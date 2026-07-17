// LEETCODE_TYPE: NumArray
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

final class NumArray {
    // TODO: Implement
    init(_ nums: [Int]) { fatalError("TODO: Implement") }
    func sumRange(_ left: Int, _ right: Int) -> Int { fatalError("TODO: Implement") }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:183ff428d085dd82cd63941f9c01e5cfdbdaa1cef923b1d9d01c1a5b3899c277
    let subject1 = NumArray([-2, 0, 3, -5, 2, -1])
    expectEqual(subject1.sumRange(0, 2), 1, "canonical[1]")
    expectEqual(subject1.sumRange(2, 5), -1, "canonical[2]")
    expectEqual(subject1.sumRange(0, 5), -3, "canonical[3]")
    let subject2 = NumArray([5])
    expectEqual(subject2.sumRange(0, 0), 5, "single[1]")
    let subject3 = NumArray([-1, -2, -3])
    expectEqual(subject3.sumRange(0, 2), -6, "negative[1]")
    expectEqual(subject3.sumRange(1, 2), -5, "negative[2]")
    let subject4 = NumArray([1, 2, 3, 4])
    expectEqual(subject4.sumRange(1, 2), 5, "subrange[1]")
    // EXCLUDED_VECTOR empty: [[{"operation":"init","arguments":[[]]}]] | The constructor receives at least one value.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
