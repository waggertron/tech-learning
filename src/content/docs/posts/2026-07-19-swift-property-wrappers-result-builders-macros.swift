@propertyWrapper
struct Clamped<Value: Comparable> {
    private var value: Value
    let range: ClosedRange<Value>

    var wrappedValue: Value {
        get { value }
        set { value = min(max(newValue, range.lowerBound), range.upperBound) }
    }

    init(wrappedValue: Value, _ range: ClosedRange<Value>) {
        self.range = range
        self.value = min(max(wrappedValue, range.lowerBound), range.upperBound)
    }
}

struct Draft {
    @Clamped(0...280) var summaryLength = 0
}

enum Rule: String {
    case titlePresent
    case bodyPresent
    case locationAllowed
}

@resultBuilder
enum RuleBuilder {
    static func buildBlock(_ parts: [Rule]...) -> [Rule] {
        parts.flatMap { $0 }
    }

    static func buildExpression(_ expression: Rule) -> [Rule] {
        [expression]
    }

    static func buildOptional(_ component: [Rule]?) -> [Rule] {
        component ?? []
    }
}

func rules(@RuleBuilder _ content: () -> [Rule]) -> [Rule] {
    content()
}

var draft = Draft()
draft.summaryLength = 500
precondition(draft.summaryLength == 280)
print("Clamped summary: \(draft.summaryLength)")

let includeLocation = true
let validation = rules {
    Rule.titlePresent
    Rule.bodyPresent
    if includeLocation {
        Rule.locationAllowed
    }
}
precondition(validation.map(\.rawValue) == [
    "titlePresent", "bodyPresent", "locationAllowed"
])
print("Rules: \(validation.map(\.rawValue).joined(separator: ", "))")
