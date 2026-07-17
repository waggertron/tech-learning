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
    private func normalized(_ values: [[Int]]) -> [[Int]] {
        values.sorted { $0.lexicographicallyPrecedes($1) }
    }

    func subsets(_ nums: [Int]) -> [[Int]] {
        var result: [[Int]] = []
        func search(_ index: Int, _ current: [Int]) { if index == nums.count { result.append(current); return }; search(index + 1, current); search(index + 1, current + [nums[index]]) }
        search(0, []); return normalized(result)
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3fa1c42d48f05c162559ffe015ea73ed16e02a1edbcd8b0f8310dd4804431a57
    expectEqual(Solution().subsets([1, 2, 3]), [[], [1], [1, 2], [1, 2, 3], [1, 3], [2], [2, 3], [3]], "three")
    expectEqual(Solution().subsets([0]), [[], [0]], "single")
    expectEqual(Solution().subsets([]), [[]], "empty")
    expectEqual(Solution().subsets([-1, 1]), [[], [-1], [-1, 1], [1]], "negative")
    expectEqual(Solution().subsets([1, 2]), [[], [1], [1, 2], [2]], "two")
    // EXCLUDED_VECTOR duplicates: [[1,1]] | All input values are unique.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
