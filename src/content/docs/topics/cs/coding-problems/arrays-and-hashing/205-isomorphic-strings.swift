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
    func isIsomorphic(_ s: String, _ t: String) -> Bool {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:a698c319713b4006868cfcad0c7bd59f13871a7b96204d94ebe5ad04fdff50d6
    expectEqual(Solution().isIsomorphic("egg", "add"), true, "egg-add")
    expectEqual(Solution().isIsomorphic("foo", "bar"), false, "foo-bar")
    expectEqual(Solution().isIsomorphic("paper", "title"), true, "paper-title")
    expectEqual(Solution().isIsomorphic("ab", "aa"), false, "target-reuse")
    expectEqual(Solution().isIsomorphic("a", "z"), true, "single")
    // EXCLUDED_VECTOR different-length: ["a","ab"] | The strings have equal length.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
