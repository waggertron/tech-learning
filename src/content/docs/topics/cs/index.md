---
title: Computer Science
description: Computer science fundamentals, data structures, NeetCode 150 walkthroughs, geospatial, routing, and software architecture patterns.
---

## Topics

- [Data Structures](./data-structures/), the top 10 data structures that show up in coding interviews, with time complexity tables, 5 common DSA uses, and Python code for each
- [LeetCode 150 (NeetCode)](./leetcode-150/), walkthroughs of all 150 NeetCode problems across 18 categories, each with brute-force, improved, and optimal approaches in Python
- [Haversine Distance](./haversine-distance/), great-circle distance between lat/lon points, with Python/SQL/JavaScript implementations and notes on when to upgrade to Vincenty or Karney
- [Vehicle Routing Problem](./vehicle-routing/), CVRP, VRPTW, pickup-and-delivery, and what Google OR-Tools actually does
- [Functional Core, Imperative Shell](./functional-core-imperative-shell/), Gary Bernhardt's architecture pattern: pure logic at the center, I/O at the edges

## How the topics connect

Each LeetCode problem page links back to the relevant data-structure pages under [Related data structures](./data-structures/). Each data-structure page lists the problems that exercise it, grouped by NeetCode category. The geospatial topics (haversine + VRP) share the distance-matrix foundation, VRP solvers typically consume haversine output.
