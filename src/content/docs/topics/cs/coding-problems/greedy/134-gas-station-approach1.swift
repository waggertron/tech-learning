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
final class Solution {
    func canCompleteCircuit(_ gas: [Int], _ cost: [Int]) -> Int {
        for start in gas.indices {
            var tank = 0, valid = true
            for step in gas.indices {
                let station = (start + step) % gas.count
                tank += gas[station] - cost[station]
                if tank < 0 { valid = false; break }
            }
            if valid { return start }
        }
        return -1
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:cf38ec67d4b22e2f3736614bea688390e3d7ca7d414a985e3bf05a180ee348e4
    expectEqual(Solution().canCompleteCircuit([1, 2, 3, 4, 5], [3, 4, 5, 1, 2]), 3, "starts-at-three")
    expectEqual(Solution().canCompleteCircuit([2, 3, 4], [3, 4, 3]), -1, "no-valid-start")
    expectEqual(Solution().canCompleteCircuit([5], [4]), 0, "single-station")
    // EXCLUDED_VECTOR mismatched-lengths: [[1,2],[1]] | Gas and cost arrays must have the same nonzero length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
