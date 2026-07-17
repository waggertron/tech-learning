struct Tag: Equatable, CustomStringConvertible {
    static let maximumLength = 24

    let value: String

    init?(_ input: String) {
        let words = input.lowercased().split(whereSeparator: { $0.isWhitespace })
        guard !words.isEmpty else { return nil }

        let normalized = words.joined(separator: "-")
        guard normalized.count <= Self.maximumLength else { return nil }
        guard normalized.allSatisfy({ character in
            character.isLetter || character.isNumber || character == "-"
        }) else { return nil }

        value = normalized
    }

    var description: String {
        "#\(value)"
    }

    var length: Int {
        value.count
    }

    func matches(prefix: String) -> Bool {
        value.hasPrefix(prefix.lowercased())
    }

    subscript(offset: Int) -> Character? {
        guard offset >= 0,
              let index = value.index(
                  value.startIndex,
                  offsetBy: offset,
                  limitedBy: value.endIndex
              ),
              index != value.endIndex else {
            return nil
        }

        return value[index]
    }
}

final class TagLease {
    let tag: Tag

    init(tag: Tag) {
        self.tag = tag
    }

    deinit {
        print("Released: \(tag)")
    }
}

let tag = Tag("  iOS Development  ")!

precondition(tag.value == "ios-development")
precondition(tag.description == "#ios-development")
precondition(tag.length == 15)
precondition(tag.matches(prefix: "IOS"))
precondition(tag[0] == "i")
precondition(tag[99] == nil)
precondition(Tag("   ") == nil)
precondition(Tag("ios!") == nil)

print("Tag: \(tag)")
print("Length: \(tag.length)")
print("First: \(tag[0].map(String.init) ?? "nil")")
print("Missing: \(tag[99].map(String.init) ?? "nil")")
print("Rejected blank: \(Tag("   ") == nil)")

do {
    let lease = TagLease(tag: tag)
    print("Lease: \(lease.tag)")
    withExtendedLifetime(lease) {}
}
