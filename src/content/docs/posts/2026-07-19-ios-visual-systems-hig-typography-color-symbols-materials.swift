enum Appearance: CaseIterable {
    case light
    case dark
}

enum Contrast: CaseIterable {
    case standard
    case increased
}

enum ContentSize: CaseIterable {
    case standard
    case accessibility
}

struct VisualTokens {
    let textPrimary: String
    let surfacePrimary: String
    let spacingUnit: Int
    let titleRole: String
    let motionScale: Double
}

func tokens(
    appearance: Appearance,
    contrast: Contrast,
    contentSize: ContentSize,
    reduceMotion: Bool
) -> VisualTokens {
    let text = contrast == .increased
        ? "label-high-contrast"
        : "label"
    let surface = appearance == .dark
        ? "system-background-dark"
        : "system-background-light"
    let spacing = contentSize == .accessibility ? 12 : 8

    return VisualTokens(
        textPrimary: text,
        surfacePrimary: surface,
        spacingUnit: spacing,
        titleRole: "title2",
        motionScale: reduceMotion ? 0 : 1
    )
}

var audited = 0
for appearance in Appearance.allCases {
    for contrast in Contrast.allCases {
        for size in ContentSize.allCases {
            let value = tokens(
                appearance: appearance,
                contrast: contrast,
                contentSize: size,
                reduceMotion: true
            )
            precondition(!value.textPrimary.isEmpty)
            precondition(!value.surfacePrimary.isEmpty)
            precondition(value.spacingUnit >= 8)
            precondition(value.titleRole == "title2")
            precondition(value.motionScale == 0)
            audited += 1
        }
    }
}

precondition(audited == 8)
print("Visual token combinations audited: \(audited)")
print("Semantic roles remain stable: true")
