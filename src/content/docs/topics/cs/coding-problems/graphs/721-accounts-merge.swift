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
    func accountsMerge(_ accounts: [[String]]) -> [[String]] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:1ba398ac53a8f608ad066da972c18cfa1278b40e8b9d206a62a59006dcc5208f
    expectEqual(Solution().accountsMerge([["John", "a@mail.com", "b@mail.com"], ["John", "b@mail.com", "c@mail.com"], ["Mary", "m@mail.com"]]), [["John", "a@mail.com", "b@mail.com", "c@mail.com"], ["Mary", "m@mail.com"]], "merges-shared-email")
    expectEqual(Solution().accountsMerge([["A", "a@mail.com"], ["B", "b@mail.com"]]), [["A", "a@mail.com"], ["B", "b@mail.com"]], "separate-accounts")
    expectEqual(Solution().accountsMerge([["Solo", "one@mail.com"]]), [["Solo", "one@mail.com"]], "single-account")
    // EXCLUDED_VECTOR missing-email: [[["Nobody"]]] | Every account must contain a name and at least one email.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
