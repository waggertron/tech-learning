---
title: "Case Study: Uber (Ride Sharing)"
description: "Geospatial system design for a ride-sharing platform: Redis GEO for driver locations, ETA-based matching over distance-based, surge pricing via stream aggregation, and the 750K writes/sec constraint that rules out every relational database."
parent: case-studies
tags: [system-design, case-studies, interviews]
status: draft
created: 2026-05-21
updated: 2026-05-21
---

The defining number for a ride-sharing platform is not the ride volume: it is the GPS update rate. Three million active drivers each sending a location update every four seconds produces 750,000 writes per second. That single calculation rules out every relational database as a primary location store and points immediately to Redis. State this number in the first two minutes of the interview and the rest of the design falls into place around it.

Note: the [Ride Sharing case study](../ride-sharing/) in this series covers the full design end-to-end. This entry focuses specifically on the geospatial layer and how the WebSocket routing pattern from [WhatsApp](../whatsapp/) is reused for real-time driver tracking, then cross-links to the full walkthrough for trip lifecycle, payment, and driver matching depth.

## Series concepts

### Introduced here

- **Redis GEO commands**: `GEOADD` stores a (longitude, latitude, member) tuple in a sorted set using geohash as the score. `GEORADIUS` queries all members within a radius. This is the idiomatic Redis pattern for nearest-neighbor geospatial queries at scale.
- **ETA-based matching**: selecting the nearest driver by GPS distance is the naive approach. ETA-based matching computes approximate travel time for the top-50 nearest candidates using pre-computed travel time grids and offers to the driver with the lowest ETA, not the shortest distance.
- **Surge pricing pipeline**: a Flink streaming job aggregates supply (available drivers) and demand (open ride requests) per geohash cell every five minutes and writes a surge multiplier to Redis with a 60-second TTL.
- **Trip state machine**: REQUESTED -> MATCHING -> DRIVER_ACCEPTED -> EN_ROUTE -> IN_TRIP -> COMPLETED, with CANCELLED reachable from any pre-trip state. State transitions are events on a Kafka topic consumed by the trip service and billing service.

### Carried forward from prior entries

- **WebSocket connection routing**: same `conn:{user_id} -> gateway_node` Redis hash used in [WhatsApp](../whatsapp/). When a driver sends a location update, the location service looks up the rider's gateway node and publishes the event there.
- **Kafka event stream**: location updates, trip events, and surge pricing inputs flow through Kafka topics. Same async pipeline from [URL Shortener](../url-shortener/).
- **Redis as primary read store**: the driver location store is Redis-first, same as the URL redirect cache in [URL Shortener](../url-shortener/). The difference is that location data is write-heavy, not read-heavy.
- **Snowflake ID generation**: trip IDs use the same distributed ID service pattern.

## Clarifying questions

Ask these before drawing anything:

- **Geography**: one city, one country, global? Partitioning strategy changes significantly.
- **Driver update frequency**: every 4 seconds is typical, but can vary.
- **Matching algorithm**: distance-only, or ETA-based with routing?
- **Surge pricing**: required? If so, granularity (city-wide vs neighborhood-level)?
- **Ride types**: just standard rides, or pools, scheduled rides, delivery?

What the answers reveal:
- Global deployment means partitioning the driver location store by city or region; a single Redis instance cannot hold the world
- ETA-based matching requires a pre-computed travel time grid, which is a background job separate from the real-time matching path
- Surge pricing adds a Flink streaming job and a separate data pipeline that does not belong on the ride-request critical path
- Pool rides require matching multiple riders to one driver, which is a combinatorial optimization problem outside normal scope

For this walkthrough: global platform, 3M active drivers, GPS update every 4 seconds, ETA-based matching, city-level surge pricing, standard rides only.

## Estimation

```
Driver location write QPS:
  3M drivers * (1 update / 4 seconds) = 750,000 writes/sec

Rider map refresh QPS:
  10M concurrent riders refreshing every 5 seconds = 2,000,000 reads/sec

Ride request QPS:
  1M rides/hour = 278 ride requests/sec

Trip storage (1 year):
  1M rides/hour * 24 * 365 = 8.76B trips/year
  Per trip record: ~500 bytes (origin, destination, driver, rider, timestamps, fare)
  8.76B * 500 bytes = ~4.4 TB/year

Location event stream:
  750K events/sec * 50 bytes/event = 37.5 MB/sec into Kafka
  Retained 24 hours for replay = ~3.2 TB/day
```

**Conclusion**: 750K location writes/sec is the constraint. Redis handles ~1M ops/sec per node. Partition by city (one Redis cluster per major city or region) to distribute the load and keep key spaces manageable.

## High-level design

```mermaid
flowchart TD
    DriverApp -->|GPS update every 4s| LocationService
    LocationService -->|GEOADD drivers:available:{city}| RedisGeo[(Redis GEO)]
    LocationService -->|publish location event| LocationTopic[Kafka: driver-locations]

    RiderApp -->|POST /rides/request| RideService
    RideService -->|GEORADIUS 5km| RedisGeo
    RideService -->|compute ETA for top 50| ETAService
    ETAService -->|offer ride to best driver| DriverApp
    DriverApp -->|accept/decline| RideService
    RideService -->|publish trip event| TripTopic[Kafka: trip-events]

    LocationTopic --> FLinkSurge[Flink: surge pricing job]
    TripTopic --> FLinkSurge
    FLinkSurge -->|surge multiplier| RedisGeo

    TripTopic --> TripService
    TripService -->|write trip record| TripDB[(PostgreSQL)]

    DriverApp -->|location update during trip| LocationService
    LocationService -->|lookup rider gateway via conn table| RedisConn[(Redis: conn table)]
    RedisConn -->|route to rider's gateway| WSGateway[WebSocket Gateway]
    WSGateway -->|driver location push| RiderApp
```

API endpoints:

```
POST /rides/request
  body:    { origin_lat, origin_lon, destination_lat, destination_lon, ride_type }
  returns: { ride_id, status: "matching", estimated_wait_seconds }

GET /rides/{ride_id}
  returns: { ride_id, status, driver_id, driver_location, eta_seconds, fare_estimate }

WebSocket /ws/rides/{ride_id}
  server pushes: { driver_lat, driver_lon, eta_seconds, status }

POST /rides/{ride_id}/cancel
  returns: { status: "cancelled", cancellation_fee }
```

## Deep dive: Redis GEO for driver locations

Redis GEO commands store geospatial data inside a sorted set, using an internal geohash encoding of (longitude, latitude) as the score. This allows range queries using ZRANGEBYSCORE under the hood:

```python
import redis

r = redis.Redis(host='redis-geo-cluster', decode_responses=True)

def update_driver_location(driver_id: str, city: str, lon: float, lat: float, available: bool):
    key = f"drivers:available:{city}" if available else f"drivers:busy:{city}"
    r.geoadd(key, [lon, lat, driver_id])

    # Separate expiry key: if no update in 30s, driver is considered offline
    r.setex(f"driver:alive:{driver_id}", 30, "1")

def find_nearby_drivers(city: str, rider_lon: float, rider_lat: float,
                         radius_km: float = 5.0, max_count: int = 50) -> list:
    results = r.georadius(
        f"drivers:available:{city}",
        rider_lon, rider_lat,
        radius_km, unit="km",
        withcoord=True,
        count=max_count,
        sort="ASC",  # nearest first
    )
    # results: [(driver_id, (lon, lat)), ...]
    return [
        {"driver_id": driver_id, "lon": lon, "lat": lat}
        for driver_id, (lon, lat) in results
        if r.exists(f"driver:alive:{driver_id}")  # filter stale entries
    ]
```

```typescript
import { createClient } from 'redis';

const client = createClient({ url: 'redis://redis-geo-cluster:6379' });
await client.connect();

interface NearbyDriver {
  driver_id: string;
  lon: number;
  lat: number;
}

async function updateDriverLocation(
  driver_id: string,
  city: string,
  lon: number,
  lat: number,
  available: boolean
): Promise<void> {
  const key = available ? `drivers:available:${city}` : `drivers:busy:${city}`;
  await client.geoAdd(key, { longitude: lon, latitude: lat, member: driver_id });

  // Separate expiry key: if no update in 30s, driver is considered offline
  await client.setEx(`driver:alive:${driver_id}`, 30, '1');
}

async function findNearbyDrivers(
  city: string,
  rider_lon: number,
  rider_lat: number,
  radius_km: number = 5.0,
  max_count: number = 50
): Promise<NearbyDriver[]> {
  const results = await client.geoRadius(
    `drivers:available:${city}`,
    { longitude: rider_lon, latitude: rider_lat },
    radius_km,
    'km',
    { SORT: 'ASC', COUNT: max_count, WITHCOORD: true }
  );
  // Filter out drivers whose alive key has expired
  const alive = await Promise.all(
    results.map(async (r) => ({
      entry: r,
      isAlive: await client.exists(`driver:alive:${r.member}`),
    }))
  );
  return alive
    .filter(({ isAlive }) => isAlive)
    .map(({ entry }) => ({
      driver_id: entry.member,
      lon: entry.coordinates!.longitude,
      lat: entry.coordinates!.latitude,
    }));
}
```

```go
package main

import (
    "context"
    "fmt"

    "github.com/redis/go-redis/v9"
)

var rdb = redis.NewClient(&redis.Options{
    Addr: "redis-geo-cluster:6379",
})

type NearbyDriver struct {
    DriverID string
    Lon      float64
    Lat      float64
}

func updateDriverLocation(ctx context.Context, driverID, city string, lon, lat float64, available bool) error {
    var key string
    if available {
        key = fmt.Sprintf("drivers:available:%s", city)
    } else {
        key = fmt.Sprintf("drivers:busy:%s", city)
    }
    err := rdb.GeoAdd(ctx, key, &redis.GeoLocation{
        Name:      driverID,
        Longitude: lon,
        Latitude:  lat,
    }).Err()
    if err != nil {
        return err
    }
    // Separate expiry key: if no update in 30s, driver is considered offline
    return rdb.SetEx(ctx, fmt.Sprintf("driver:alive:%s", driverID), "1", 30).Err()
}

func findNearbyDrivers(ctx context.Context, city string, riderLon, riderLat, radiusKm float64, maxCount int) ([]NearbyDriver, error) {
    results, err := rdb.GeoRadius(ctx, fmt.Sprintf("drivers:available:%s", city),
        riderLon, riderLat,
        &redis.GeoRadiusQuery{
            Radius:    radiusKm,
            Unit:      "km",
            WithCoord: true,
            Count:     maxCount,
            Sort:      "ASC",
        },
    ).Result()
    if err != nil {
        return nil, err
    }

    var drivers []NearbyDriver
    for _, r := range results {
        exists, err := rdb.Exists(ctx, fmt.Sprintf("driver:alive:%s", r.Name)).Result()
        if err != nil || exists == 0 {
            continue // filter stale entries
        }
        drivers = append(drivers, NearbyDriver{
            DriverID: r.Name,
            Lon:      r.Longitude,
            Lat:      r.Latitude,
        })
    }
    return drivers, nil
}
```

One subtlety: `GEORADIUS` returns drivers ordered by distance, but distance and ETA diverge significantly in dense urban areas. A driver 0.5 km away on a one-way street system may take four minutes to reach you; a driver 1.2 km away on a clear arterial may take two minutes. The ETA layer handles this.

The city-level partition key (`drivers:available:{city}`) keeps each Redis cluster bounded. A city like New York with 50K active drivers at peak is a manageable sorted set. Do not use a global key: it creates a hot spot and makes partial failure handling difficult.

## Deep dive: ETA-based matching

The matching service takes the 50 nearest drivers from the GEO query and ranks them by estimated arrival time:

```python
import heapq

def match_rider_to_driver(ride_id: str, rider_location: dict, city: str) -> str | None:
    candidates = find_nearby_drivers(city, rider_location["lon"], rider_location["lat"])
    if not candidates:
        return None

    # Compute ETA for each candidate using pre-computed travel time grid
    eta_heap = []
    for driver in candidates:
        eta_seconds = estimate_eta(
            origin=(driver["lon"], driver["lat"]),
            destination=(rider_location["lon"], rider_location["lat"]),
            city=city,
        )
        heapq.heappush(eta_heap, (eta_seconds, driver["driver_id"]))

    # Offer to drivers in ETA order, cascade on decline
    while eta_heap:
        eta, driver_id = heapq.heappop(eta_heap)
        accepted = send_ride_offer(driver_id, ride_id, timeout_seconds=10)
        if accepted:
            return driver_id

    return None  # no driver accepted

def estimate_eta(origin: tuple, destination: tuple, city: str) -> float:
    # Travel time grid: pre-computed 500m x 500m cells, updated every 5 minutes
    # by a background job that analyzes historical trip speed data
    grid_key = f"travel_grid:{city}"
    cell_from = latlon_to_cell(origin)
    cell_to = latlon_to_cell(destination)
    # Simple lookup; production uses A* over the grid
    return travel_time_grid_lookup(grid_key, cell_from, cell_to)
```

```typescript
interface RiderLocation {
  lon: number;
  lat: number;
}

async function matchRiderToDriver(
  ride_id: string,
  rider_location: RiderLocation,
  city: string
): Promise<string | null> {
  const candidates = await findNearbyDrivers(city, rider_location.lon, rider_location.lat);
  if (candidates.length === 0) return null;

  // Compute ETA for each candidate using pre-computed travel time grid
  const withEta = await Promise.all(
    candidates.map(async (driver) => ({
      driver_id: driver.driver_id,
      eta: await estimateEta(
        { lon: driver.lon, lat: driver.lat },
        rider_location,
        city
      ),
    }))
  );

  // Sort by ETA ascending, offer in order, cascade on decline
  withEta.sort((a, b) => a.eta - b.eta);
  for (const { driver_id } of withEta) {
    const accepted = await sendRideOffer(driver_id, ride_id, 10);
    if (accepted) return driver_id;
  }

  return null; // no driver accepted
}

async function estimateEta(
  origin: RiderLocation,
  destination: RiderLocation,
  city: string
): Promise<number> {
  // Travel time grid: pre-computed 500m x 500m cells, updated every 5 minutes
  // by a background job that analyzes historical trip speed data
  const grid_key = `travel_grid:${city}`;
  const cell_from = latlonToCell(origin);
  const cell_to = latlonToCell(destination);
  // Simple lookup; production uses A* over the grid
  return travelTimeGridLookup(grid_key, cell_from, cell_to);
}
```

```go
package main

import "sort"

type DriverETA struct {
    DriverID string
    ETA      float64
}

func matchRiderToDriver(ctx context.Context, rideID string, riderLon, riderLat float64, city string) (string, error) {
    candidates, err := findNearbyDrivers(ctx, city, riderLon, riderLat, 5.0, 50)
    if err != nil {
        return "", err
    }
    if len(candidates) == 0 {
        return "", nil // no driver found
    }

    // Compute ETA for each candidate using pre-computed travel time grid
    etaList := make([]DriverETA, 0, len(candidates))
    for _, driver := range candidates {
        eta, err := estimateETA(ctx, driver.Lon, driver.Lat, riderLon, riderLat, city)
        if err != nil {
            continue
        }
        etaList = append(etaList, DriverETA{DriverID: driver.DriverID, ETA: eta})
    }

    // Offer to drivers in ETA order, cascade on decline
    sort.Slice(etaList, func(i, j int) bool { return etaList[i].ETA < etaList[j].ETA })
    for _, d := range etaList {
        accepted, err := sendRideOffer(ctx, d.DriverID, rideID, 10)
        if err == nil && accepted {
            return d.DriverID, nil
        }
    }

    return "", nil // no driver accepted
}

func estimateETA(ctx context.Context, originLon, originLat, destLon, destLat float64, city string) (float64, error) {
    // Travel time grid: pre-computed 500m x 500m cells, updated every 5 minutes
    // by a background job that analyzes historical trip speed data
    gridKey := fmt.Sprintf("travel_grid:%s", city)
    cellFrom := latlonToCell(originLon, originLat)
    cellTo := latlonToCell(destLon, destLat)
    // Simple lookup; production uses A* over the grid
    return travelTimeGridLookup(ctx, gridKey, cellFrom, cellTo)
}
```

The travel time grid is a 2D array of average travel speeds per grid cell, updated every five minutes by a batch job that reads recent trip GPS traces. It is stored in Redis as a serialized numpy array per city. This avoids calling an external routing service (Google Maps, OSRM) on every match request, which would add 50-200ms of latency and significant cost.

## Deep dive: real-time driver location push to rider

Once a trip is matched, the rider needs to see the driver moving on the map. This reuses the WhatsApp WebSocket routing pattern:

```python
def handle_driver_location_update(driver_id: str, lon: float, lat: float):
    # 1. Update GEO index (driver is now busy, not available)
    r_geo.geoadd(f"drivers:busy:{get_driver_city(driver_id)}", [lon, lat, driver_id])

    # 2. Find the rider for this driver's current trip
    trip_id = r.get(f"driver:current_trip:{driver_id}")
    if not trip_id:
        return  # driver not on a trip

    rider_id = r.get(f"trip:rider:{trip_id}")
    if not rider_id:
        return

    # 3. Find the rider's WebSocket gateway (same conn table as WhatsApp)
    gateway_node = r.hget("conn:gateway", rider_id)
    if not gateway_node:
        return  # rider not connected

    # 4. Publish location event to that gateway node
    kafka_producer.send(
        f"gateway-events:{gateway_node}",
        value={
            "type": "driver_location",
            "rider_id": rider_id,
            "driver_id": driver_id,
            "lon": lon,
            "lat": lat,
            "eta_seconds": estimate_eta_to_rider(driver_id, rider_id),
        }
    )
```

```typescript
import { Kafka } from 'kafkajs';
import { createClient } from 'redis';

const kafka = new Kafka({ clientId: 'location-service', brokers: ['kafka:9092'] });
const producer = kafka.producer();
const rGeo = createClient({ url: 'redis://redis-geo-cluster:6379' });
const r = createClient({ url: 'redis://redis-main:6379' });

interface DriverLocationEvent {
  type: string;
  rider_id: string;
  driver_id: string;
  lon: number;
  lat: number;
  eta_seconds: number;
}

async function handleDriverLocationUpdate(
  driver_id: string,
  lon: number,
  lat: number
): Promise<void> {
  // 1. Update GEO index (driver is now busy, not available)
  const city = await getDriverCity(driver_id);
  await rGeo.geoAdd(`drivers:busy:${city}`, { longitude: lon, latitude: lat, member: driver_id });

  // 2. Find the rider for this driver's current trip
  const trip_id = await r.get(`driver:current_trip:${driver_id}`);
  if (!trip_id) return; // driver not on a trip

  const rider_id = await r.get(`trip:rider:${trip_id}`);
  if (!rider_id) return;

  // 3. Find the rider's WebSocket gateway (same conn table as WhatsApp)
  const gateway_node = await r.hGet('conn:gateway', rider_id);
  if (!gateway_node) return; // rider not connected

  // 4. Publish location event to that gateway node
  const event: DriverLocationEvent = {
    type: 'driver_location',
    rider_id,
    driver_id,
    lon,
    lat,
    eta_seconds: await estimateEtaToRider(driver_id, rider_id),
  };
  await producer.send({
    topic: `gateway-events:${gateway_node}`,
    messages: [{ value: JSON.stringify(event) }],
  });
}
```

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"

    "github.com/redis/go-redis/v9"
    "github.com/segmentio/kafka-go"
)

type DriverLocationEvent struct {
    Type       string  `json:"type"`
    RiderID    string  `json:"rider_id"`
    DriverID   string  `json:"driver_id"`
    Lon        float64 `json:"lon"`
    Lat        float64 `json:"lat"`
    ETASeconds float64 `json:"eta_seconds"`
}

func handleDriverLocationUpdate(ctx context.Context, driverID string, lon, lat float64) error {
    // 1. Update GEO index (driver is now busy, not available)
    city, err := getDriverCity(ctx, driverID)
    if err != nil {
        return err
    }
    if err := rGeo.GeoAdd(ctx, fmt.Sprintf("drivers:busy:%s", city), &redis.GeoLocation{
        Name: driverID, Longitude: lon, Latitude: lat,
    }).Err(); err != nil {
        return err
    }

    // 2. Find the rider for this driver's current trip
    tripID, err := rdb.Get(ctx, fmt.Sprintf("driver:current_trip:%s", driverID)).Result()
    if err == redis.Nil {
        return nil // driver not on a trip
    }
    if err != nil {
        return err
    }

    riderID, err := rdb.Get(ctx, fmt.Sprintf("trip:rider:%s", tripID)).Result()
    if err == redis.Nil {
        return nil
    }
    if err != nil {
        return err
    }

    // 3. Find the rider's WebSocket gateway (same conn table as WhatsApp)
    gatewayNode, err := rdb.HGet(ctx, "conn:gateway", riderID).Result()
    if err == redis.Nil {
        return nil // rider not connected
    }
    if err != nil {
        return err
    }

    // 4. Publish location event to that gateway node
    eta, _ := estimateETAToRider(ctx, driverID, riderID)
    event := DriverLocationEvent{
        Type: "driver_location", RiderID: riderID, DriverID: driverID,
        Lon: lon, Lat: lat, ETASeconds: eta,
    }
    payload, err := json.Marshal(event)
    if err != nil {
        return err
    }
    w := kafka.NewWriter(kafka.WriterConfig{
        Brokers: []string{"kafka:9092"},
        Topic:   fmt.Sprintf("gateway-events:%s", gatewayNode),
    })
    defer w.Close()
    return w.WriteMessages(ctx, kafka.Message{Value: payload})
}
```

The gateway node consumes from its own Kafka partition (`gateway-events:{node_id}`) and pushes the event over the rider's WebSocket. The rider's map updates in near-real-time without polling.

## Deep dive: surge pricing pipeline

Surge pricing is a stream aggregation problem: count supply and demand per geographic cell per time window, compute a ratio, and apply a multiplier:

```python
# Flink pseudocode (Python API)
from pyflink.datastream import StreamExecutionEnvironment
from pyflink.datastream.window import TumblingEventTimeWindows
from datetime import timedelta

env = StreamExecutionEnvironment.get_execution_environment()

driver_stream = env.add_source(kafka_source("driver-locations"))
ride_request_stream = env.add_source(kafka_source("ride-requests"))

# Count available drivers per geohash cell per 5-minute window
supply = (driver_stream
    .filter(lambda e: e["status"] == "available")
    .map(lambda e: (latlon_to_geohash(e["lat"], e["lon"], precision=5), 1))
    .key_by(lambda x: x[0])
    .window(TumblingEventTimeWindows.of(timedelta(minutes=5)))
    .sum(1))

# Count ride requests per geohash cell per 5-minute window
demand = (ride_request_stream
    .map(lambda e: (latlon_to_geohash(e["origin_lat"], e["origin_lon"], precision=5), 1))
    .key_by(lambda x: x[0])
    .window(TumblingEventTimeWindows.of(timedelta(minutes=5)))
    .sum(1))

# Join supply and demand, compute surge multiplier
def compute_surge(cell: str, supply_count: int, demand_count: int) -> float:
    ratio = demand_count / max(supply_count, 1)
    if ratio < 1.2:
        return 1.0
    elif ratio < 2.0:
        return 1.5
    elif ratio < 3.0:
        return 2.0
    else:
        return min(ratio * 0.8, 4.0)  # cap at 4x

# Write surge multipliers to Redis with 60s TTL
# Consumer writes: SET surge:{geohash_cell} {multiplier} EX 60
```

```typescript
import { Kafka } from 'kafkajs';
import { createClient } from 'redis';

// Surge pricing consumer: reads aggregated supply/demand counts from Kafka
// and writes multipliers to Redis. A separate stream processor (e.g. Kafka Streams)
// produces those aggregated counts from the raw driver-locations and ride-requests topics.

const kafka = new Kafka({ clientId: 'surge-consumer', brokers: ['kafka:9092'] });
const consumer = kafka.consumer({ groupId: 'surge-pricing' });
const redisClient = createClient({ url: 'redis://redis-main:6379' });

interface SurgeAggregate {
  cell: string;        // geohash cell at precision 5
  supply_count: number;
  demand_count: number;
}

function computeSurge(supply_count: number, demand_count: number): number {
  const ratio = demand_count / Math.max(supply_count, 1);
  if (ratio < 1.2) return 1.0;
  if (ratio < 2.0) return 1.5;
  if (ratio < 3.0) return 2.0;
  return Math.min(ratio * 0.8, 4.0); // cap at 4x
}

async function runSurgeConsumer(): Promise<void> {
  await consumer.connect();
  await redisClient.connect();
  await consumer.subscribe({ topic: 'surge-aggregates', fromBeginning: false });

  await consumer.run({
    eachMessage: async ({ message }) => {
      const agg: SurgeAggregate = JSON.parse(message.value!.toString());
      const multiplier = computeSurge(agg.supply_count, agg.demand_count);
      // Write surge multiplier to Redis with 60s TTL
      await redisClient.setEx(`surge:${agg.cell}`, 60, String(multiplier));
    },
  });
}
```

```go
package main

import (
    "context"
    "encoding/json"
    "fmt"
    "math"
    "time"

    "github.com/redis/go-redis/v9"
    "github.com/segmentio/kafka-go"
)

// SurgeAggregate is produced by the upstream stream processor (Kafka Streams / Flink)
// and consumed here to write multipliers to Redis.
type SurgeAggregate struct {
    Cell         string `json:"cell"`          // geohash cell at precision 5
    SupplyCount  int    `json:"supply_count"`
    DemandCount  int    `json:"demand_count"`
}

func computeSurge(supplyCount, demandCount int) float64 {
    supply := math.Max(float64(supplyCount), 1)
    ratio := float64(demandCount) / supply
    switch {
    case ratio < 1.2:
        return 1.0
    case ratio < 2.0:
        return 1.5
    case ratio < 3.0:
        return 2.0
    default:
        return math.Min(ratio*0.8, 4.0) // cap at 4x
    }
}

func runSurgeConsumer(ctx context.Context, rdb *redis.Client) error {
    r := kafka.NewReader(kafka.ReaderConfig{
        Brokers: []string{"kafka:9092"},
        Topic:   "surge-aggregates",
        GroupID: "surge-pricing",
    })
    defer r.Close()

    for {
        msg, err := r.ReadMessage(ctx)
        if err != nil {
            return err
        }
        var agg SurgeAggregate
        if err := json.Unmarshal(msg.Value, &agg); err != nil {
            continue
        }
        multiplier := computeSurge(agg.SupplyCount, agg.DemandCount)
        // Write surge multiplier to Redis with 60s TTL
        key := fmt.Sprintf("surge:%s", agg.Cell)
        if err := rdb.SetEx(ctx, key, fmt.Sprintf("%.2f", multiplier), 60*time.Second).Err(); err != nil {
            return err
        }
    }
}
```

The surge multiplier is applied at ride request time: the fare estimate shown to the rider uses `base_fare * surge_multiplier`. Because the multiplier has a 60-second TTL, stale data degrades gracefully: if the Flink job is delayed, the multiplier defaults to 1.0 (no surge) rather than showing an incorrect value.

## Failure modes

**Redis GEO cluster node failure**: consistent hashing routes most keys to surviving nodes. Drivers on the failed node's keyspace stop appearing in GEORADIUS queries until the node recovers or is replaced. Drivers do not disappear from active trips (trip state is in PostgreSQL); only new matching is affected.

**Driver stops sending GPS updates**: the `driver:alive:{driver_id}` key expires after 30 seconds. The driver is filtered out of GEORADIUS results automatically. If the driver is on an active trip, the rider's map stops updating but the trip record is unaffected.

**Matching cascade failure**: all 50 driver candidates decline the ride offer (rare but possible at the edge of a service area). Widen the search radius to 10 km and retry. After three failed rounds, return the rider an estimated wait time and queue the request.

**Flink job lag**: if the surge pricing job falls behind, multipliers age out via the 60-second TTL and new rides are priced at 1.0x. This is the correct failure mode: under-charge rather than over-charge based on stale data.

## Key takeaways

**750K writes/sec is the number that wins the argument.** Stating it clearly and immediately, then connecting it to "therefore Redis, not Postgres," shows you understand how to derive architecture from constraints.

**GPS distance and ETA are not the same thing.** Matching on distance is a common first-instinct answer. The upgrade to ETA-based matching is the insight that demonstrates product awareness: riders care about when the car arrives, not how many meters away it is.

**Geohash-based partitioning scales naturally.** Partitioning the driver location store by city (or by geohash prefix for finer granularity) maps cleanly to Redis keyspace partitioning and to geographic failure isolation.

**The WebSocket pattern is a general tool.** The same conn-table routing used to deliver chat messages in WhatsApp delivers driver location updates here. Recognizing structural reuse across problems demonstrates pattern-level thinking.

**Surge pricing must not be on the critical path.** Computing supply and demand ratios synchronously during a ride request would add hundreds of milliseconds and create a dependency on the streaming job's availability. Precompute and cache.

## References

- [Uber Engineering: How Uber Manages Millions of Location Events Per Second](https://www.uber.com/blog/location-data/)
- [Uber Engineering: Surge Pricing and Geospatial Demand Modeling](https://www.uber.com/blog/surge-pricing/)
- [Redis GEO commands documentation](https://redis.io/docs/data-types/geospatial/)
- [System Design Interview Vol 2, Alex Xu, Chapter 5](https://bytebytego.com/)

## Related topics

- [Case Study: Ride Sharing](../ride-sharing/), full trip lifecycle design including payment and driver onboarding
- [Case Study: WhatsApp](../whatsapp/), WebSocket gateway routing pattern reused here
- [Caching](../../caching/), Redis GEO as a geospatial index
- [Message Queues](../../message-queues/), Kafka for location event stream and surge pricing pipeline
- [Consistent Hashing](../../consistent-hashing/), partitioning the driver location store by city
- [Scalability](../../scalability/), horizontal scaling of the location service
