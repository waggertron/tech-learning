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
    func maxProduct(_ nums: [Int]) -> Int { var best = nums[0]; for i in nums.indices { var product = 1; for j in i..<nums.count { product *= nums[j]; best = max(best, product) } }; return best }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:0f7dd71f35d2a4e87b475aabb4e69849fe47a32390976c6990b905dc6c5dd58f
    expectEqual(Solution().maxProduct([2, 3, -2, 4]), 6, "positive-run")
    expectEqual(Solution().maxProduct([-2, 0, -1]), 0, "zero-split")
    expectEqual(Solution().maxProduct([-2, 3, -4]), 24, "negative-sign-flip")
    expectEqual(Solution().maxProduct([-2]), -2, "single-negative")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one value.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
