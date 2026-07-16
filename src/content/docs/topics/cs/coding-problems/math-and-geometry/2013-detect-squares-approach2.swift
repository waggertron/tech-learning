// LEETCODE_TYPE: DetectSquares
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

private struct Point: Hashable {
    let x: Int
    let y: Int
}

final class DetectSquares {
    private var counts: [Point: Int] = [:]

    init() {}

    func add(_ point: [Int]) {
        counts[Point(x: point[0], y: point[1]), default: 0] += 1
    }

    func count(_ point: [Int]) -> Int {
        let query = Point(x: point[0], y: point[1])
        var total = 0
        for (diagonal, frequency) in counts {
            let dx = diagonal.x - query.x
            let dy = diagonal.y - query.y
            guard dx != 0, abs(dx) == abs(dy) else { continue }
            total += frequency
                * counts[Point(x: diagonal.x, y: query.y), default: 0]
                * counts[Point(x: query.x, y: diagonal.y), default: 0]
        }
        return total
    }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:4ef45011a19ca0416102c3f3d251992fdba33cd44d09a88bf8257f3b4833bbb4
    let subject1 = DetectSquares()
    subject1.add([3, 10])
    subject1.add([11, 2])
    subject1.add([3, 2])
    expectEqual(subject1.count([11, 10]), 1, "canonical-sequence[4]")
    expectEqual(subject1.count([14, 8]), 0, "canonical-sequence[5]")
    subject1.add([11, 2])
    expectEqual(subject1.count([11, 10]), 2, "canonical-sequence[7]")
    let subject2 = DetectSquares()
    subject2.add([2, 2])
    subject2.add([0, 0])
    subject2.add([0, 2])
    subject2.add([4, 0])
    subject2.add([4, 2])
    subject2.add([2, 0])
    expectEqual(subject2.count([2, 0]), 2, "two-orientations[7]")
    let subject3 = DetectSquares()
    expectEqual(subject3.count([0, 0]), 0, "empty-store[1]")
    let subject4 = DetectSquares()
    subject4.add([1, 0])
    subject4.add([1, 0])
    subject4.add([0, 1])
    subject4.add([1, 1])
    expectEqual(subject4.count([0, 0]), 2, "duplicate-corners[5]")
    // EXCLUDED_VECTOR missing-constructor: [[{"operation":"count","arguments":[[0,0]]}]] | Executable operation sequences must begin with init.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
