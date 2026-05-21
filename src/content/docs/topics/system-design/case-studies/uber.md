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

Note: the [Ride Sharing case study](./ride-sharing/) in this series covers the full design end-to-end. This entry focuses specifically on the geospatial layer and how the WebSocket routing pattern from [WhatsApp](./whatsapp/) is reused for real-time driver tracking, then cross-links to the full walkthrough for trip lifecycle, payment, and driver matching depth.

## Series concepts

### Introduced here

- **Redis GEO commands**: `GEOADD` stores a (longitude, latitude, member) tuple in a sorted set using geohash as the score. `GEORADIUS` queries all members within a radius. This is the idiomatic Redis pattern for nearest-neighbor geospatial queries at scale.
- **ETA-based matching**: selecting the nearest driver by GPS distance is the naive approach. ETA-based matching computes approximate travel time for the top-50 nearest candidates using pre-computed travel time grids and offers to the driver with the lowest ETA, not the shortest distance.
- **Surge pricing pipeline**: a Flink streaming job aggregates supply (available drivers) and demand (open ride requests) per geohash cell every five minutes and writes a surge multiplier to Redis with a 60-second TTL.
- **Trip state machine**: REQUESTED -> MATCHING -> DRIVER_ACCEPTED -> EN_ROUTE -> IN_TRIP -> COMPLETED, with CANCELLED reachable from any pre-trip state. State transitions are events on a Kafka topic consumed by the trip service and billing service.

### Carried forward from prior entries

- **WebSocket connection routing**: same `conn:{user_id} -> gateway_node` Redis hash used in [WhatsApp](./whatsapp/). When a driver sends a location update, the location service looks up the rider's gateway node and publishes the event there.
- **Kafka event stream**: location updates, trip events, and surge pricing inputs flow through Kafka topics. Same async pipeline from [URL Shortener](./url-shortener/).
- **Redis as primary read store**: the driver location store is Redis-first, same as the URL redirect cache in [URL Shortener](./url-shortener/). The difference is that location data is write-heavy, not read-heavy.
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

- [Case Study: Ride Sharing](./ride-sharing/), full trip lifecycle design including payment and driver onboarding
- [Case Study: WhatsApp](./whatsapp/), WebSocket gateway routing pattern reused here
- [Caching](../caching/), Redis GEO as a geospatial index
- [Message Queues](../message-queues/), Kafka for location event stream and surge pricing pipeline
- [Consistent Hashing](../consistent-hashing/), partitioning the driver location store by city
- [Scalability](../scalability/), horizontal scaling of the location service
