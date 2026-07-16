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
    func asteroidCollision(_ asteroids: [Int]) -> [Int] {
        // TODO: Implement
        fatalError("TODO: Implement")
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:32d091d23b9fae45385abc25d111d6b3696bf4214622625888742349e8b9552e
    expectEqual(Solution().asteroidCollision([5, 10, -5]), [5, 10], "smaller-left-mover")
    expectEqual(Solution().asteroidCollision([8, -8]), [], "equal-collision")
    expectEqual(Solution().asteroidCollision([10, 2, -5]), [10], "chain-collision")
    expectEqual(Solution().asteroidCollision([-2, -1, 1, 2]), [-2, -1, 1, 2], "moving-apart")
    expectEqual(Solution().asteroidCollision([1]), [1], "single-asteroid")
    // EXCLUDED_VECTOR empty-array: [[]] | The published input contains at least one asteroid.
    // EXCLUDED_VECTOR zero-size: [[0]] | Asteroid sizes are nonzero.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
