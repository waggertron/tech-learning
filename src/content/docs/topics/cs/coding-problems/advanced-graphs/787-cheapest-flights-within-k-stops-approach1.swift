// LEETCODE_TYPE: Solution
func expectEqual<T: Equatable>(
    _ actual: T,
    _ expected: T,
    _ message: String = "",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard actual == expected else {
        let detail = message.isEmpty ? "values differ" : message
        fatalError("\(file):\(line): \(detail). Expected \(expected), got \(actual)")
    }
}

func expectTrue(
    _ condition: @autoclosure () -> Bool,
    _ message: String = "expected true",
    file: StaticString = #fileID,
    line: UInt = #line
) {
    guard condition() else {
        fatalError("\(file):\(line): \(message)")
    }
}

func reportSuccess() {
    print("All Swift tests passed")
}

// SWIFT_CATALOG_HELPER: BinaryHeap
struct BinaryHeap<Element> {
    private var elements: [Element] = []
    private let hasHigherPriority: (Element, Element) -> Bool

    init(hasHigherPriority: @escaping (Element, Element) -> Bool) {
        self.hasHigherPriority = hasHigherPriority
    }

    var count: Int { elements.count }
    var isEmpty: Bool { elements.isEmpty }
    var peek: Element? { elements.first }

    mutating func insert(_ element: Element) {
        elements.append(element)
        siftUp(from: elements.count - 1)
    }

    mutating func removeRoot() -> Element? {
        guard !elements.isEmpty else { return nil }
        if elements.count == 1 { return elements.removeLast() }

        elements.swapAt(0, elements.count - 1)
        let root = elements.removeLast()
        siftDown(from: 0)
        return root
    }

    private mutating func siftUp(from start: Int) {
        var child = start
        while child > 0 {
            let parent = (child - 1) / 2
            guard hasHigherPriority(elements[child], elements[parent]) else { return }
            elements.swapAt(child, parent)
            child = parent
        }
    }

    private mutating func siftDown(from start: Int) {
        var parent = start
        while true {
            let left = parent * 2 + 1
            guard left < elements.count else { return }
            let right = left + 1
            var candidate = left
            if right < elements.count && hasHigherPriority(elements[right], elements[left]) {
                candidate = right
            }
            guard hasHigherPriority(elements[candidate], elements[parent]) else { return }
            elements.swapAt(parent, candidate)
            parent = candidate
        }
    }
}

final class Solution {
    func findCheapestPrice(_ n: Int, _ flights: [[Int]], _ src: Int, _ dst: Int, _ k: Int) -> Int {
        var graph = Array(repeating: [(Int,Int)](), count:n); for flight in flights { graph[flight[0]].append((flight[1],flight[2])) }; let infinity=Int.max/4; var memo=Array(repeating:Array(repeating:-2,count:k+2),count:n)
        func solve(_ node:Int,_ edges:Int)->Int { if node==dst { return 0 }; if edges==0 { return infinity }; if memo[node][edges] != -2 { return memo[node][edges] }; var best=infinity; for (next,cost) in graph[node] { let suffix=solve(next,edges-1); if suffix<infinity { best=min(best,cost+suffix) } }; memo[node][edges]=best; return best }
        let answer=solve(src,k+1); return answer==infinity ? -1 : answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:b385459593ac4e4946915f96f5d727c2afd40e58deb78294d28cef9dffedb5e6
    expectEqual(Solution().findCheapestPrice(4, [[0, 1, 100], [1, 2, 100], [2, 3, 100], [0, 2, 500]], 0, 3, 1), 600, "one-stop-limit")
    expectEqual(Solution().findCheapestPrice(4, [[0, 1, 100], [1, 2, 100], [2, 3, 100], [0, 2, 500]], 0, 3, 2), 300, "two-stop-limit")
    expectEqual(Solution().findCheapestPrice(3, [[0, 1, 100], [1, 2, 100], [0, 2, 500]], 0, 2, 0), 500, "direct-only")
    expectEqual(Solution().findCheapestPrice(3, [[0, 1, 100]], 0, 2, 1), -1, "unreachable")
    expectEqual(Solution().findCheapestPrice(1, [], 0, 0, 0), 0, "same-city")
    // EXCLUDED_VECTOR zero-cities: [0,[],0,0,0] | At least one city is provided.
    // EXCLUDED_VECTOR negative-stops: [2,[[0,1,5]],0,1,-1] | The stop limit is nonnegative.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
