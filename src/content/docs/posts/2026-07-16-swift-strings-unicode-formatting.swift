import Foundation

func normalizedSearchText(_ text: String) -> String {
    text
        .precomposedStringWithCanonicalMapping
        .folding(
            options: [.caseInsensitive, .diacriticInsensitive],
            locale: Locale(identifier: "en_US_POSIX")
        )
        .split(whereSeparator: \.isWhitespace)
        .joined(separator: " ")
}

let composed = "  Café TRAIL  "
let decomposed = "Cafe\u{301} trail"
let normalizedComposed = normalizedSearchText(composed)
let normalizedDecomposed = normalizedSearchText(decomposed)

precondition(normalizedComposed == normalizedDecomposed)

let family = "👨‍👩‍👧‍👦"
precondition(family.count == 1)

let timestamp = Date(timeIntervalSince1970: 0)
let timestampText = timestamp.formatted(.iso8601)

let distance = Measurement(value: 3.2, unit: UnitLength.kilometers)
let distanceText = distance.formatted(
    .measurement(
        width: .abbreviated,
        usage: .asProvided,
        numberFormatStyle: .number.precision(.fractionLength(1))
    )
    .locale(Locale(identifier: "en_US_POSIX"))
)

print("Search key: \(normalizedComposed)")
print("Family characters: \(family.count), UTF-8 bytes: \(family.utf8.count)")
print("Timestamp: \(timestampText)")
print("Distance: \(distanceText)")
