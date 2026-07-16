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
    func canAttendMeetings(_ intervals: [[Int]]) -> Bool {
        var events: [(time: Int, delta: Int)] = []
        for interval in intervals { events.append((interval[0], 1)); events.append((interval[1], -1)) }
        events.sort { $0.time == $1.time ? $0.delta < $1.delta : $0.time < $1.time }
        var active = 0
        for event in events { active += event.delta; if active > 1 { return false } }
        return true
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:6fff3378d6ea968c1db8a912015492534ddde8967f08e4392d60b45b2ac19812
    expectEqual(Solution().canAttendMeetings([[0, 30], [5, 10], [15, 20]]), false, "overlapping-meetings")
    expectEqual(Solution().canAttendMeetings([[7, 10], [2, 4]]), true, "separate-meetings")
    expectEqual(Solution().canAttendMeetings([[0, 10], [10, 20]]), true, "touching-meetings")
    expectEqual(Solution().canAttendMeetings([]), true, "no-meetings")
    // EXCLUDED_VECTOR reversed-meeting: [[[4,2]]] | Meeting start times must be less than end times.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
