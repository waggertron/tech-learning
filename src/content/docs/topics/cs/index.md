---
title: Computer Science
description: "Computer science fundamentals, data structures, NeetCode 150 walkthroughs, geospatial, routing, and software architecture patterns."
---

## Topics

- [Data Structures](./data-structures/), the top 10 data structures that show up in coding interviews, with time complexity tables, 5 common DSA uses, and Python code for each
- [Coding Problems](./coding-problems/), walkthroughs of all 150 NeetCode problems across 18 categories, each with brute-force, improved, and optimal approaches in Python
- [Coding Concepts](./coding-concepts/), approach tactics behind coding problems: two pointers, sliding windows, greedy proofs, DP states, graph traversal, monotonic structures, and more
- [Haversine Distance](./haversine-distance/), great-circle distance between lat/lon points, with Python/SQL/JavaScript implementations and notes on when to upgrade to Vincenty or Karney
- [Vehicle Routing Problem](./vehicle-routing/), CVRP, VRPTW, pickup-and-delivery, and what Google OR-Tools actually does
- [Functional Core, Imperative Shell](./functional-core-imperative-shell/), Gary Bernhardt's architecture pattern: pure logic at the center, I/O at the edges
- [Flight Itinerary with Transfers](./flight-itinerary/), find a valid trip through a flight graph with departure and arrival times: DFS, BFS for fewest layovers, Dijkstra for earliest arrival, plus the time-expanded graph framework that subsumes all three
- [Named Algorithms](./named-algorithms/), the canon worth knowing by sight: Kadane's, Floyd's, Dijkstra's, KMP, and the rest
- [Technology Laws](./technology-laws/), named laws and principles every software engineer will encounter: Conway, Brooks, Amdahl, Little, Goodhart, Hyrum, Gall, Schneier, and more
- [Graph Theory](./graph-theory/), deep dive into terminology, graph types, components, SCCs, DAGs, bipartite [graphs](data-structures/graphs/), weighted-graph problem modeling
- [Sentinel Values](./sentinel-values/), the "impossible" placeholder pattern across DP, shortest-path, search, and linked-list problems
- [Design Patterns](./design-patterns/), the 23 Gang of Four patterns grouped by intent: creational, structural, and behavioral, with TypeScript, Python, and Go implementations
- [Kademlia DHT](./kademlia-dht/), XOR metric, k-buckets, iterative lookup, and the four RPCs behind BitTorrent mainline DHT, IPFS, and Ethereum devp2p, with Python, TypeScript, and Go implementations

## How the topics connect

Each LeetCode problem page links back to neighboring problems and, when useful, to the approach pages under [Coding Concepts](./coding-concepts/). Concept pages link back to representative problems so a learner can drill the tactic directly. The geospatial topics (haversine + VRP) share the distance-matrix foundation, VRP solvers typically consume haversine output.
