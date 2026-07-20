---
title: UIKit's event-driven mental model and app lifecycle
description: "Trace UIKit from application and scene setup through the run loop, responder chain, view controllers, and main-thread interface updates."
date: 2026-07-19
tags: [ios, swift, uikit, lifecycle, scenes]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-uikit-event-driven-mental-model-app-lifecycle/
series:
  slug: zero-to-ios-hero
  order: 45
---

UIKit builds interfaces from long-lived objects. Views and controllers receive events, mutate properties, coordinate children, and respond to lifecycle callbacks.

## Follow the ownership chain

```text
UIApplication
    |
    v
UISceneSession -> UIWindowScene -> UIWindow
                              |
                              v
                    root view controller
                              |
                              v
                         view hierarchy
```

The application coordinates process-level events. Each scene represents one interface instance. A window presents a root controller. Controllers coordinate a screen or contained region, not the entire product and not the durable domain model.

## Launch a programmatic scene

```swift
import UIKit

final class SceneDelegate: UIResponder, UIWindowSceneDelegate {
    var window: UIWindow?

    func scene(
        _ scene: UIScene,
        willConnectTo session: UISceneSession,
        options connectionOptions: UIScene.ConnectionOptions
    ) {
        guard let windowScene = scene as? UIWindowScene else { return }

        let window = UIWindow(windowScene: windowScene)
        window.rootViewController = UINavigationController(
            rootViewController: NoteListViewController()
        )
        self.window = window
        window.makeKeyAndVisible()
    }
}
```

The composition root should inject the note library rather than let the controller construct persistence or networking dependencies.

## Treat callbacks by repeat behavior

`viewDidLoad` runs after the controller loads its view and fits one-time hierarchy setup. Appearance callbacks can run many times. Layout callbacks can run frequently. Starting an unguarded fetch in `viewDidLayoutSubviews` can create a request loop.

```swift
@MainActor
final class NoteListViewController: UIViewController {
    override func viewDidLoad() {
        super.viewDidLoad()
        title = "Field Notes"
        view.backgroundColor = .systemBackground
        configureHierarchy()
        configureConstraints()
    }
}
```

UIKit events arrive through target-action, delegates, notifications, data sources, gestures, and the responder chain. The main run loop processes events and schedules interface work. UI mutation stays on the main actor.

## Scenes can outlive assumptions

The app may have several scenes. A scene can move through foreground and background without the process terminating. Persist valuable work before relying on a later callback, and make lifecycle handling safe to repeat.

## Validation boundary

The code was not compiled or launched. Scene configuration, Info.plist wiring, lifecycle order, run-loop behavior, and main-thread diagnostics remain Not verified.

## Series navigation

- Previous: [Part 44: SwiftUI Field Notes capstone](../2026-07-19-swiftui-field-notes-capstone/)
- Next: [Part 46: UIKit views, controls, target-action, and delegation](../2026-07-19-uikit-views-controls-configuration-target-action-delegation/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [UIKit](https://developer.apple.com/documentation/uikit) is the framework overview.
- [Managing your app's life cycle](https://developer.apple.com/documentation/uikit/app_and_environment/managing_your_app_s_life_cycle) covers scenes and application state.
- [UIViewController](https://developer.apple.com/documentation/uikit/uiviewcontroller) defines controller responsibilities and lifecycle.

## Related topics

- [Xcode, simulators, devices, debugging, and Git](../2026-07-16-xcode-simulators-devices-git/)
- [Adaptive design for iPhone, iPad, and windows](../2026-07-19-ios-adaptive-design-iphone-ipad-windows/)
