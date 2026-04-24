---
title: Haversine Distance
description: The haversine formula, great-circle distance between two lat/lon points on a sphere. When it's accurate enough, when to upgrade to Vincenty or Karney, and ready-to-use implementations in Python, SQL, and JavaScript.
category: cs
tags: [geospatial, distance, haversine, great-circle, vrp]
status: draft
created: 2026-04-24
updated: 2026-04-24
---

## What it computes

**Great-circle distance** is the length of the shortest path between two points *on the surface* of a sphere, a curved arc, not a straight line. For the Earth, that's the path a plane or ship actually travels when it follows the optimal route. Planar Euclidean distance is accurate only for small regions (tens of kilometers); the error grows with distance and latitude.

The **haversine formula** gives great-circle distance from two pairs of latitude and longitude in one tidy trigonometric expression. It's the default tool for any application where "how far is it between these coordinates?" needs a real answer.

## The formula

Given two points with latitudes φ₁, φ₂ and longitudes λ₁, λ₂ (all in radians), and Earth radius R:

```
Δφ = φ₂ − φ₁
Δλ = λ₂ − λ₁

a = sin²(Δφ/2) + cos(φ₁)·cos(φ₂)·sin²(Δλ/2)
c = 2 · atan2(√a, √(1−a))
d = R · c
```

`a` is the squared chord half-length normalized to a unit sphere. `c` is the central angle in radians. Multiplying by `R` gives arc length on the surface.

### Why `atan2`, not `asin`

A mathematically equivalent form is `c = 2·asin(√a)`. Don't use it. When two points are nearly antipodal (opposite sides of Earth), `a` approaches 1, and floating-point rounding can push it a hair above 1. `asin` of anything greater than 1 is undefined, NaN or an exception depending on language. The `atan2(√a, √(1−a))` form is well-conditioned across the entire range; it doesn't need a `min(1, √a)` clamp.

One edge case remains: for exactly antipodal points, `atan2` gets `(0, 0)` and may return NaN. Handle it: if distance would be NaN, set `d = π · R`.

## Earth radius

Earth is an oblate spheroid, not a perfect sphere. WGS-84 defines:

| Radius | Value (km) | Notes |
| --- | --- | --- |
| Equatorial | 6378.137 | Semi-major axis |
| Polar | 6356.752 | Semi-minor axis |
| Mean | **6371.009** | The value most implementations use |

Because of this ellipsoidal shape, haversine on a spherical Earth has a **maximum error of about 0.5%** relative to the true ellipsoidal distance. For most applications that's plenty; for surveying or aerospace work, see "when to upgrade" below.

## Python, a clean reference implementation

Using only the standard library:

```python
import math

EARTH_RADIUS_KM = 6371.0088

def haversine_km(lat1, lon1, lat2, lon2):
    """Great-circle distance between two lat/lon points in kilometers."""
    phi1 = math.radians(lat1)
    phi2 = math.radians(lat2)
    dphi = math.radians(lat2, lat1)
    dlam = math.radians(lon2, lon1)

    a = (math.sin(dphi / 2) ** 2
         + math.cos(phi1) * math.cos(phi2) * math.sin(dlam / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1, a))
    return EARTH_RADIUS_KM * c
```

Vectorized with NumPy for batches of coordinates:

```python
import numpy as np

def haversine_km_np(lat1, lon1, lat2, lon2):
    """Vectorized haversine. All args can be scalars or arrays."""
    phi1 = np.radians(lat1)
    phi2 = np.radians(lat2)
    dphi = np.radians(lat2, lat1)
    dlam = np.radians(lon2, lon1)

    a = (np.sin(dphi / 2) ** 2
         + np.cos(phi1) * np.cos(phi2) * np.sin(dlam / 2) ** 2)
    return 6371.0088 * 2 * np.arctan2(np.sqrt(a), np.sqrt(1, a))
```

Using `geopy` (spherical / haversine):

```python
from geopy.distance import great_circle
great_circle((41.49, -71.31), (41.50, -81.70)).km
```

Using `geopy` (ellipsoidal / Karney, **more accurate**):

```python
from geopy.distance import distance   # alias for geodesic
distance((41.49, -71.31), (41.50, -81.70)).km
```

The [`haversine` package on PyPI](https://pypi.org/project/haversine/) is another option; it supports km, miles, nautical miles, and feet.

## SQL, one-liner distance queries

**PostGIS** on the `geography` type uses Karney's algorithm (ellipsoidal) under the hood, more accurate than pure haversine:

```sql
SELECT ST_Distance(
  'SRID=4326;POINT(-71.31 41.49)'::geography,
  'SRID=4326;POINT(-81.70 41.50)'::geography
) AS meters;
```

For a faster, spherical-only answer, use `ST_DistanceSphere`:

```sql
SELECT ST_DistanceSphere(
  ST_MakePoint(-71.31, 41.49),
  ST_MakePoint(-81.70, 41.50)
) AS meters;
```

**MySQL 8+**:

```sql
SELECT ST_Distance_Sphere(
  POINT(-71.31, 41.49),
  POINT(-81.70, 41.50)
) AS meters;
```

> **Argument-order gotcha:** Both PostGIS `ST_MakePoint` and MySQL `POINT()` use **(longitude, latitude)**, the reverse of the usual `(lat, lon)` convention. Mixing them up silently swaps your coordinates and returns plausible-looking wrong numbers.

**Raw SQL** (no spatial extension), in case you're on vanilla SQLite or similar:

```sql
SELECT 6371 * 2 * asin(sqrt(
    power(sin(radians(lat2, lat1) / 2), 2)
    + cos(radians(lat1)) * cos(radians(lat2))
      * power(sin(radians(lon2, lon1) / 2), 2)
)) AS km
FROM points;
```

Note this uses the `asin` form, add a clamp to avoid domain errors on near-antipodal points: `asin(least(1, sqrt(...)))`.

## JavaScript

Using [Turf.js](https://turfjs.org/):

```js
import distance from '@turf/distance';
const d = distance([lon1, lat1], [lon2, lat2], { units: 'kilometers' });
```

Or a vanilla implementation:

```js
const R = 6371.0088;   // km

function haversineKm(lat1, lon1, lat2, lon2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const phi1 = toRad(lat1);
  const phi2 = toRad(lat2);
  const dphi = toRad(lat2, lat1);
  const dlam = toRad(lon2, lon1);

  const a = Math.sin(dphi / 2) ** 2
          + Math.cos(phi1) * Math.cos(phi2) * Math.sin(dlam / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1, a));
}
```

## When haversine is enough, and when to upgrade

Quick decision table:

| Use case | Accuracy needed | Pick |
| --- | --- | --- |
| Map display, "miles from me" | ±1% | **Haversine** |
| Proximity search, geofencing | ±1% | **Haversine** |
| Ride-hailing ETA | ±1% | Haversine + road-graph correction |
| Logistics, VRP distance matrix | ±0.5% | Haversine (or actual road time) |
| Surveying / cadastral | sub-meter | **Vincenty** or **Karney (GeographicLib)** |
| Aerospace | sub-meter | **Karney** |

**Vincenty's formulae** solve the geodesic on the WGS-84 ellipsoid directly, ~0.5 mm accuracy, but the inverse iteration can fail to converge for near-antipodal point pairs.

**Karney's algorithm (GeographicLib)** reformulates geodesic inversion as 1-D root-finding; converges for every input pair; accurate to about 12 nanometers with doubles. This is what `geopy.distance.geodesic` uses, and what PostGIS geography-type distance uses under the hood.

## Gotchas

- **Radians vs. degrees.** All trig functions want radians. Lat/lon from databases, JSON, and users is almost always in degrees. Converting is the #1 bug.
- **Longitude wrap-around at ±180°.** Points near the International Date Line can have longitudes `179` and `-179`. The arithmetic difference is 358° but the actual angular separation is 2°. Haversine handles this correctly because `sin²(Δλ/2)` is periodic in Δλ - but any hand-rolled code that short-circuits on `|lon2, lon1| > 90` or similar will break.
- **Bearing ≠ distance.** Haversine gives only distance. Initial bearing (forward azimuth) uses a different formula.
- **Argument order in spatial SQL.** `(lon, lat)` in PostGIS / MySQL point constructors.
- **Floating-point at sub-meter distances.** Double precision loses significant digits in `sin²(Δφ/2)` below a few centimeters. Use Karney for short-range precision work.
- **Antipodal inputs.** If your inputs can be nearly antipodal, handle the NaN-edge case explicitly.

## A sanity check

Distance from New York City (40.7128, -74.0060) to London (51.5074, -0.1278):

- Haversine (R = 6371.0088): **~5570 km**
- Karney (WGS-84 geodesic): **~5585 km**

Error ~0.3%, typical for long-range measurements.

## References

- [Haversine formula, Wikipedia](https://en.wikipedia.org/wiki/Haversine_formula), definition, history, derivation, numerical stability
- [Great-circle distance, Wikipedia](https://en.wikipedia.org/wiki/Great-circle_distance), spherical trigonometry context
- [Calculate distance and bearing between Lat/Long points, Chris Veness](https://www.movable-type.co.uk/scripts/latlong.html), the canonical practitioner reference, JavaScript implementation
- [GeographicLib, Karney's geodesic library](https://geographiclib.sourceforge.io/), C++, Python, Java, JavaScript bindings for sub-mm geodesic distance
- [geopy distance documentation](https://geopy.readthedocs.io/en/stable/), `great_circle` (haversine) and `geodesic` (Karney) APIs
- [PostGIS ST_DistanceSphere](https://postgis.net/docs/ST_DistanceSphere.html) and [ST_Distance on geography](https://postgis.net/docs/ST_Distance.html)
- [MySQL 8, ST_Distance_Sphere](https://dev.mysql.com/doc/refman/8.4/en/spatial-convenience-functions.html)
- [Turf.js distance API](https://turfjs.org/docs/api/distance)
- [Vincenty's formulae, Wikipedia](https://en.wikipedia.org/wiki/Vincenty's_formulae)
- R. W. Sinnott, "Virtues of the Haversine," *Sky and Telescope* 68(2), 159 (1984), the modern computational rediscovery
