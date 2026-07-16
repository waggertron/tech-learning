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
    func plusOne(_ digits: [Int]) -> [Int] {
        var result = digits
        for index in result.indices.reversed() {
            if result[index] < 9 {
                result[index] += 1
                return result
            }
            result[index] = 0
        }
        result.insert(1, at: 0)
        return result
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:809e15b2cce38cfa709cadcc2741d5ad55d2c0ebde4fce5ba32e5a6cd9bfa0c9
    expectEqual(Solution().plusOne([1, 2, 3]), [1, 2, 4], "no-carry")
    expectEqual(Solution().plusOne([1, 2, 9, 9]), [1, 3, 0, 0], "carry-through-suffix")
    expectEqual(Solution().plusOne([9, 9, 9]), [1, 0, 0, 0], "all-nines")
    expectEqual(Solution().plusOne([0]), [1], "single-zero")
    expectEqual(Solution().plusOne([9]), [1, 0], "single-nine")
    // EXCLUDED_VECTOR empty-digits: [[]] | The digit array must contain at least one digit.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
