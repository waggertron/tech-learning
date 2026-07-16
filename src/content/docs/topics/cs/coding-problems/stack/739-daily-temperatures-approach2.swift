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
    func dailyTemperatures(_ temperatures: [Int]) -> [Int] {
        var answer = Array(repeating: 0, count: temperatures.count)
        var stack: [Int] = []
        for day in temperatures.indices.reversed() {
            while let last = stack.last, temperatures[last] <= temperatures[day] { stack.removeLast() }
            if let warmer = stack.last { answer[day] = warmer - day }
            stack.append(day)
        }
        return answer
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:5d5ffe3028c3ff11eca39520d412811ca493a38310ed44e98e75915626792f91
    expectEqual(Solution().dailyTemperatures([73, 74, 75, 71, 69, 72, 76, 73]), [1, 1, 4, 2, 1, 1, 0, 0], "classic")
    expectEqual(Solution().dailyTemperatures([30, 40, 50, 60]), [1, 1, 1, 0], "increasing")
    expectEqual(Solution().dailyTemperatures([90, 80, 70]), [0, 0, 0], "decreasing")
    expectEqual(Solution().dailyTemperatures([70]), [0], "single-day")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one temperature.
    // EXCLUDED_VECTOR out-of-range: [[20]] | Published temperatures range from 30 through 100.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
