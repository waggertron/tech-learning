enum WidthClass: CaseIterable {
    case compact
    case regular
}

enum InputMode: CaseIterable {
    case touch
    case pointerAndKeyboard
}

enum NavigationPresentation: String {
    case stack
    case split
}

struct LayoutEnvironment {
    let width: Int
    let widthClass: WidthClass
    let input: InputMode
    let prefersMultipleColumns: Bool
}

struct LayoutDecision {
    let navigation: NavigationPresentation
    let keepsSidebarVisible: Bool
    let showsKeyboardShortcuts: Bool
}

func decideLayout(for environment: LayoutEnvironment) -> LayoutDecision {
    let canFitColumns =
        environment.widthClass == .regular
        && environment.width >= 700
        && environment.prefersMultipleColumns

    return LayoutDecision(
        navigation: canFitColumns ? .split : .stack,
        keepsSidebarVisible: canFitColumns,
        showsKeyboardShortcuts: environment.input == .pointerAndKeyboard
    )
}

let environments = [
    LayoutEnvironment(
        width: 390,
        widthClass: .compact,
        input: .touch,
        prefersMultipleColumns: false
    ),
    LayoutEnvironment(
        width: 820,
        widthClass: .regular,
        input: .pointerAndKeyboard,
        prefersMultipleColumns: true
    ),
    LayoutEnvironment(
        width: 600,
        widthClass: .regular,
        input: .touch,
        prefersMultipleColumns: true
    ),
]

let decisions = environments.map(decideLayout)
precondition(decisions[0].navigation == .stack)
precondition(decisions[1].navigation == .split)
precondition(decisions[1].showsKeyboardShortcuts)
precondition(decisions[2].navigation == .stack)

print("Compact phone: \(decisions[0].navigation.rawValue)")
print("Wide window: \(decisions[1].navigation.rawValue)")
print("Narrow regular window: \(decisions[2].navigation.rawValue)")
print("Keyboard shortcuts visible: \(decisions[1].showsKeyboardShortcuts)")
