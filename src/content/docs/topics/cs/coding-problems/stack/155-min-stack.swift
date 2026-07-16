// LEETCODE_TYPE: MinStack
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

final class MinStack {
    // TODO: Implement
    init() {}
    func push(_ value: Int) { fatalError("TODO: Implement") }
    func pop() { fatalError("TODO: Implement") }
    func top() -> Int { fatalError("TODO: Implement") }
    func getMin() -> Int { fatalError("TODO: Implement") }
}

func runTests() {
    // TEST_VECTORS_BEGIN sha256:f1c6e2e1a9c5a5724e5d8f888835a3f02e82bf81b16ad03984378fcf1e6378e9
    let subject1 = MinStack()
    subject1.push(-2)
    subject1.push(0)
    subject1.push(-3)
    expectEqual(subject1.getMin(), -3, "sequence[4]")
    subject1.pop()
    expectEqual(subject1.top(), 0, "sequence[6]")
    expectEqual(subject1.getMin(), -2, "sequence[7]")
    let subject2 = MinStack()
    subject2.push(2)
    subject2.push(2)
    expectEqual(subject2.getMin(), 2, "duplicate-minimum[3]")
    subject2.pop()
    expectEqual(subject2.getMin(), 2, "duplicate-minimum[5]")
    let subject3 = MinStack()
    subject3.push(7)
    expectEqual(subject3.top(), 7, "single-value[2]")
    expectEqual(subject3.getMin(), 7, "single-value[3]")
    subject3.pop()
    // EXCLUDED_VECTOR pop-empty: [[{"operation":"init","arguments":[]},{"operation":"pop","arguments":[]}]] | The published operation sequence does not pop an empty stack.
    // TEST_VECTORS_END
    reportSuccess()
}

runTests()
