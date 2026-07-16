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
    func isPalindrome(_ s: String) -> Bool {
        let cleaned = s.filter { $0.isLetter || $0.isNumber }.map(normalized)
        guard !cleaned.isEmpty else { return true }
        var left = 0
        var right = cleaned.count - 1
        while left < right {
            if cleaned[left] != cleaned[right] { return false }
            left += 1
            right -= 1
        }
        return true
    }

    private func normalized(_ character: Character) -> Character {
        Character(String(character).lowercased())
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:3683285cf1b4b5bbae328f205dea0c49520dcc7ea7ad4bac59d8b301f96200f8
    expectEqual(Solution().isPalindrome("A man, a plan, a canal: Panama"), true, "phrase-palindrome")
    expectEqual(Solution().isPalindrome("race a car"), false, "not-palindrome")
    expectEqual(Solution().isPalindrome("0P"), false, "digits-and-letters")
    expectEqual(Solution().isPalindrome(" "), true, "punctuation-only")
    expectEqual(Solution().isPalindrome("z"), true, "single-character")
    // EXCLUDED_VECTOR non-ascii-character: ["été"] | The published input alphabet is printable ASCII.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
