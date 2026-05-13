from collections import defaultdict
import heapq

def find_itinerary(tickets):
    graph = defaultdict(list)
    for src, dst in tickets:
        heapq.heappush(graph[src], dst)

    itinerary = []
    def dfs(node):
        while graph[node]:
            nb = heapq.heappop(graph[node])
            dfs(nb)
        itinerary.append(node)

    dfs("JFK")
    return itinerary[::-1]

assert find_itinerary([["MUC","LHR"],["JFK","MUC"],["SFO","SJC"],["LHR","SFO"]]) == ["JFK","MUC","LHR","SFO","SJC"]
assert find_itinerary([["JFK","SFO"],["JFK","ATL"],["SFO","ATL"],["ATL","JFK"],["ATL","SFO"]]) == ["JFK","ATL","JFK","SFO","ATL","SFO"]
assert find_itinerary([["JFK","ATL"]]) == ["JFK","ATL"]
assert find_itinerary([["JFK","A"],["A","B"],["B","C"]]) == ["JFK","A","B","C"]
assert find_itinerary([["JFK","ATL"],["ATL","JFK"]]) == ["JFK","ATL","JFK"]
print("all tests pass")
