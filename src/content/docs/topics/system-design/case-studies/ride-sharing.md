---
title: "Case Study: Ride Sharing"
description: "Full system design walkthrough for an Uber-style ride sharing platform: geospatial location storage at scale, the matching algorithm, real-time tracking via WebSockets, surge pricing with stream processing, and the trip state machine."
parent: case-studies
tags: [system-design, case-studies, interviews, geospatial, real-time]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Ride sharing is one of the richest system design problems. It combines geospatial indexing, real-time location at massive scale, matching under latency constraints, stream-based pricing, and a stateful trip lifecycle. The key insight that most candidates miss: the driver location update problem (750K writes/sec from 3M active drivers sending GPS every 4 seconds) is the dominant technical challenge -- not the booking flow, which is comparatively straightforward.

## Clarifying questions

- **Which flows to focus on?** Location tracking, matching, pricing, payment, or driver earnings? (Pick 2-3 in 45 minutes.)
- **Geography**: single city, one country, or global with localized pricing?
- **Vehicle types**: ride-hailing only, or also food delivery, package delivery?
- **Matching constraints**: ETA-based matching or closest-driver?
- **Surge pricing**: required? Real-time or periodic updates?
- **What defines success?** Match rate? Match latency? Driver utilization?

What the answers reveal:
- Food delivery changes the matching problem significantly (multiple pickups, restaurant wait times)
- Global with localized pricing means partition-by-region is required from the start
- Real-time surge pricing requires stream processing (Flink or Spark Streaming)

For this walkthrough: ride-hailing, global, ETA-based matching, real-time surge pricing. Focus on location tracking, matching, and real-time communication.

## Estimation

```
Scale:
  3M active drivers worldwide (sending GPS every 4 seconds)
  10M concurrent riders (some requesting, some in-trip, some idle)
  1M rides/hour = 278 rides/sec

Driver location update rate:
  3M drivers / 4 seconds = 750,000 location writes/sec
  Peak: assume 2x = 1.5M writes/sec
  This is the dominant write load -- everything else is minor in comparison

Rider map view updates:
  10M riders viewing a map, each needs driver positions refreshed every 5 sec
  Positions are read from cache; this is 2M reads/sec (manageable with Redis)

Storage:
  Current location: 3M drivers * 100 bytes = 300 MB (fits in Redis RAM)
  Location history: 1M rides/hour * avg 30 min * 1 update/4s = 450M location points/hour
    At 100 bytes each: 45 GB/hour location history -- write to Cassandra
  Trip records: 1M rides/hour * 500 bytes = 500 MB/hour = 4.4 TB/year
```

**Conclusion**: the 750K location writes/sec is the defining constraint. A relational DB will saturate. Redis (in-memory, single-threaded atomic operations, ~1M ops/sec per node) with a Cluster of 2+ nodes handles this. The architectural decisions flow from this number.

## High-level design

```
DRIVER APP                        RIDER APP
  |                                   |
  | GPS update every 4s              | Request ride / view map
  v                                   v
[WebSocket Gateway Fleet]        [WebSocket Gateway Fleet]
  |                                   |
  v                                   |
[Location Service]          [Matching Service] <-- Rider requests here
  |                                   |
  v                                   v
[Redis Geo Cluster]          [Redis Geo Cluster] (query nearby available drivers)
  |                                   |
  +---[Cassandra] (history)  [ETA Service] (call routing API for ETA per candidate)
                                       |
                             [Trip Service]
                             [Trip DB (PostgreSQL)]
                                       |
                             [Notification Service]
                             (notify driver of match offer)
```

APIs:

```
WebSocket (driver):
  location_update: { lat, lon, heading, speed, available: bool }
  trip_offer:      { trip_id, rider_name, pickup_lat, pickup_lon, estimated_fare }
  offer_response:  { trip_id, accepted: bool }

WebSocket (rider):
  ride_request:    { pickup_lat, pickup_lon, dropoff_lat, dropoff_lon }
  driver_location: { driver_id, lat, lon }  (pushed every 4s when in trip)
  match_found:     { driver_id, driver_name, eta_seconds, vehicle }

HTTP:
  GET  /surge-pricing?lat={lat}&lon={lon}  -> { multiplier: 1.8 }
  GET  /fare-estimate?pickup=...&dropoff=...  -> { low: 12.50, high: 15.00 }
  POST /trips/{id}/complete  -> { final_fare }
```

## Deep dive: location storage at scale

750K location writes/sec requires an in-memory store. Redis geospatial commands are the canonical solution.

**Redis GEO commands**:

```python
import redis

r = redis.Redis()

# Driver sends GPS update
def update_driver_location(driver_id: int, lat: float, lon: float, city: str):
    # Key per city to keep sorted set sizes manageable
    r.geoadd(f"drivers:available:{city}", (lon, lat, driver_id))
    # Also update "last seen" for staleness detection
    r.setex(f"driver:loc:{driver_id}", 30, f"{lat},{lon}")  # TTL = 30 seconds

# Find available drivers within 5 km
def find_nearby_drivers(lat: float, lon: float, city: str, radius_km: float = 5) -> list:
    results = r.georadius(
        f"drivers:available:{city}",
        longitude=lon,
        latitude=lat,
        radius=radius_km,
        unit="km",
        withcoord=True,
        withdist=True,
        count=50,        # top 50 candidates
        sort="ASC"       # closest first
    )
    return results
```

**Partitioning by city**: a global sorted set with 3M drivers would be large but still fits in RAM (~300 MB). Partitioning by city keeps each sorted set small, enables horizontal scaling (different Redis nodes handle different cities), and makes geographic isolation natural.

**Stale location detection**: a driver who loses connection should not remain in the available pool. The `driver:loc:{driver_id}` key has a 30-second TTL -- if the driver has not sent a location update in 30 seconds, the key expires. A background worker (runs every 15 seconds) removes drivers from the available sorted set if their location key has expired:

```python
def clean_stale_drivers(city: str):
    all_drivers = r.zrange(f"drivers:available:{city}", 0, -1)
    for driver_id in all_drivers:
        if not r.exists(f"driver:loc:{driver_id}"):
            r.zrem(f"drivers:available:{city}", driver_id)
```

## Deep dive: matching algorithm

When a rider requests a ride, the matching service:

1. Queries nearby available drivers (GEORADIUS, top 50 candidates)
2. Filters for truly available drivers (not already matched, not on another trip)
3. Ranks by ETA -- not by GPS distance. A driver 0.5 km away on a highway may have a longer ETA than one 1 km away on a clear surface street.
4. Sends a match offer to the top candidate
5. Waits up to 10 seconds for the driver to accept
6. On decline or timeout, sends to the next candidate

```python
import heapq

def match_rider(rider_request: dict) -> dict | None:
    lat, lon = rider_request["pickup_lat"], rider_request["pickup_lon"]
    city = geocode_to_city(lat, lon)

    candidates = find_nearby_drivers(lat, lon, city, radius_km=5)
    if not candidates:
        return None  # no drivers available

    # Compute ETA for each candidate in parallel (call routing service)
    etas = compute_etas_parallel(
        [(driver_id, driver_lat, driver_lon) for driver_id, (driver_lat, driver_lon), dist in candidates],
        destination=(lat, lon)
    )

    # Rank by ETA
    ranked = sorted(etas, key=lambda x: x["eta_seconds"])

    # Offer to drivers in order
    for candidate in ranked:
        driver_id = candidate["driver_id"]
        accepted = send_offer_and_wait(driver_id, rider_request, timeout=10)
        if accepted:
            return {"driver_id": driver_id, "eta": candidate["eta_seconds"]}

    return None  # no driver accepted
```

**ETA computation**: calling the routing API for 50 candidates would be slow. Approximate ETAs using pre-computed travel time matrices per city zone (updated every 5 minutes). Only run the precise routing API call for the top 5 candidates after the approximation-based filtering.

**Match latency SLO**: the goal is to match within 15 seconds of the rider's request. This means: geospatial query (<5ms) + ETA approximation (<20ms) + driver notification (<50ms) + driver acceptance (up to 10s). The driver acceptance is the dominant term.

## Deep dive: real-time tracking via WebSockets

Once matched, the rider needs to see the driver's position updating in real time.

**Connection routing** (same pattern as the chat system):

```
Redis: conn:{driver_id} -> gateway_server_id
Redis: conn:{rider_id}  -> gateway_server_id
```

When a driver sends a location update, the location service:
1. Updates Redis GEO
2. Looks up the driver's current trip (if any): `trip:{driver_id} -> trip_id`
3. Looks up the rider for that trip: `trip:{trip_id}:rider -> rider_id`
4. Looks up the rider's gateway server: `conn:{rider_id} -> gateway_server_id`
5. Publishes the location to that gateway's pub/sub channel

```python
def handle_location_update(driver_id: int, lat: float, lon: float):
    # Update available pool
    update_driver_location(driver_id, lat, lon, city)

    # Push to rider if in trip
    trip_id = r.get(f"trip:{driver_id}")
    if trip_id:
        rider_id = r.get(f"trip:{trip_id}:rider")
        if rider_id:
            gateway_id = r.get(f"conn:{rider_id}")
            if gateway_id:
                r.publish(f"gateway:{gateway_id}", json.dumps({
                    "type": "driver_location",
                    "rider_id": int(rider_id),
                    "lat": lat,
                    "lon": lon,
                }))
```

The rider's gateway subscribes to its channel, receives the message, and pushes it over the rider's WebSocket connection. End-to-end latency: driver GPS -> gateway -> location service -> Redis -> gateway -> rider WebSocket: typically 50-200ms.

## Deep dive: surge pricing

Surge pricing adjusts the fare multiplier based on supply (available drivers) and demand (ride requests) per geographic zone.

**Stream processing approach**:

```
Kafka Topic: driver-location-updates (750K events/sec)
Kafka Topic: ride-requests (278 events/sec)

Flink Job:
  - Consume both topics
  - For each 5km x 5km geohash cell:
    - Count available drivers (supply)
    - Count ride requests in last 5 minutes (demand)
    - Compute surge = f(demand / supply)
    - Emit (geohash_cell, surge_multiplier) to output topic

Output Topic: surge-multipliers
  -> Surge Cache (Redis): geohash -> multiplier (TTL 60 seconds)
```

```python
def compute_surge_multiplier(demand: int, supply: int) -> float:
    if supply == 0:
        return 3.0  # cap at 3x when no drivers available
    ratio = demand / supply
    if ratio < 0.5:   return 1.0   # plenty of drivers
    if ratio < 1.0:   return 1.2
    if ratio < 1.5:   return 1.5
    if ratio < 2.0:   return 1.8
    return min(3.0, 1.0 + ratio)  # cap at 3x

def get_surge(lat: float, lon: float) -> float:
    cell = geohash.encode(lat, lon, precision=4)  # ~40km x 20km cell
    multiplier = r.get(f"surge:{cell}")
    return float(multiplier) if multiplier else 1.0
```

The Flink job updates surge prices every 5 minutes (configurable). Redis TTL matches the update interval. Riders see the current surge multiplier before accepting the fare.

## Trip state machine

The trip has a clear lifecycle. Representing it as a state machine prevents invalid transitions:

```
REQUESTED --> MATCHING --> DRIVER_ACCEPTED --> DRIVER_EN_ROUTE
                                                     |
                                                PICKUP_ARRIVED
                                                     |
                                                  IN_TRIP
                                                     |
                                                  COMPLETED
                                                     |
                                    +----> CANCELLED (from any state before IN_TRIP)
```

Each transition is a DB update + event publication. The trip state is stored in PostgreSQL (ACID transactions for financial correctness -- the fare must be charged exactly once on COMPLETED). Trip state is also mirrored in Redis for low-latency reads (rider app polling "is driver on the way?").

## Failure modes

**Location service overload**: 750K writes/sec and one Redis node goes down. Redis Cluster redistributes the load to remaining nodes; ~33% of location data is temporarily lost (those keys move to other nodes). Drivers whose keys migrated appear briefly unavailable. The 30-second TTL means they reappear on the next GPS update.

**Matching service failure**: no new matches are created. Riders see "searching for a driver" indefinitely. Alert immediately (p99 match time is a key SLO). Restart the service; in-flight match offers are retried from the Kafka topic.

**WebSocket gateway crash**: drivers and riders on that gateway are disconnected. Clients reconnect to any available gateway. Trip state is in Redis/PostgreSQL, so reconnecting clients can restore their view. Drivers resume sending location updates; the trip service reconnects the location-to-rider pipeline.

**Surge pricing Flink job failure**: surge prices become stale (Redis TTL expires, all prices default to 1.0). This means no surge pricing -- acceptable as a degraded mode. Alert and restart the Flink job.

## Key takeaways

**750K location writes/sec is the key number.** It immediately rules out relational databases and points to Redis (in-memory, ~1M ops/sec per node). State this calculation early and explicitly -- it shows you can size a system correctly.

**Partition the driver location store by city, not globally.** A single global sorted set with 3M drivers works (300 MB), but partitioning by city keeps each set small, makes horizontal sharding natural, and enables city-specific availability logic. The extra complexity is worth it at scale.

**ETA beats GPS distance for matching quality.** A driver 0.5 km away on a highway may have a 5-minute ETA. A driver 1 km away on clear streets may have a 2-minute ETA. Sorting by ETA instead of distance directly improves match quality. ETA computation is expensive, though -- use approximate pre-computed ETAs for filtering, precise routing for final selection.

**The trip state machine is the financial source of truth.** The COMPLETED transition triggers the payment charge. It must happen exactly once. This means PostgreSQL (not Redis) with ACID transactions for trip state, and an idempotency key for the payment service call.

**Surge pricing is a stream processing problem.** Demand and supply change continuously. You need a real-time computation (Flink or Spark Streaming) that aggregates supply and demand per zone every few minutes and updates a cache. Batch processing (hourly MapReduce) is too slow; per-request computation is too expensive.

## References

- [Uber engineering: how Uber manages 1M writes/sec on location data](https://www.uber.com/blog/engineering/)
- [Uber H3 geospatial indexing library](https://h3geo.org/)
- [Lyft engineering: matching at scale](https://eng.lyft.com/)
- [Redis GEO commands documentation](https://redis.io/docs/data-types/geo/)

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach used in this walkthrough
- [Consistent Hashing](../../consistent-hashing/), sharding the driver location store across Redis nodes
- [Message Queues](../../message-queues/), Kafka for surge pricing stream processing
- [CAP Theorem](../../cap-theorem/), why location storage accepts brief staleness (AP design)
- [Notification System](./notification-system/), delivering match offers and trip updates to drivers and riders
