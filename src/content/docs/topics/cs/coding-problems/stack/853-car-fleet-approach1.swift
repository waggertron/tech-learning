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
    func carFleet(_ target: Int, _ position: [Int], _ speed: [Int]) -> Int {
        var times = zip(position, speed).map { (position: $0.0, time: Double(target - $0.0) / Double($0.1)) }.sorted { $0.position > $1.position }.map(\.time)
        var index = 1
        while index < times.count {
            if times[index] <= times[index - 1] { times.remove(at: index) } else { index += 1 }
        }
        return times.count
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:962cb26d07df400ec194a87083ea2a4d3f2486acb0c8d7aa086cec4dcf3c593d
    expectEqual(Solution().carFleet(12, [10, 8, 0, 5, 3], [2, 4, 1, 1, 3]), 3, "classic")
    expectEqual(Solution().carFleet(100, [0, 2, 4], [4, 2, 1]), 1, "one-fleet")
    expectEqual(Solution().carFleet(10, [6, 8], [3, 2]), 2, "separate-fleets")
    expectEqual(Solution().carFleet(10, [3], [3]), 1, "single-car")
    // EXCLUDED_VECTOR length-mismatch: [10,[1,2],[1]] | Position and speed must describe the same cars.
    // EXCLUDED_VECTOR position-at-target: [10,[10],[1]] | Every starting position must be less than the target.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
