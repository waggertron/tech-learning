func average(_ values: [Int]) -> Int {
    precondition(!values.isEmpty, "Average needs at least one reading.")

    let total = values.reduce(0, +)
    let divisor = values.count
    return total / divisor
}

let readings = [2, 4, 6]
let observed = average(readings)
let expected = 4

assert(observed == expected, "Expected \(expected), got \(observed)")
print("Average: \(observed)")
