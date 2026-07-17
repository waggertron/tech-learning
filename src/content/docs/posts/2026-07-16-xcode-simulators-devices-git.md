---
title: "Zero to iOS Hero 2: Xcode, simulators, devices, and Git"
description: "The path from an Xcode project to simulated and physical destinations, with signing, diagnostics, Derived Data, and the first Git checkpoint."
date: 2026-07-16
tags: [swift, ios, xcode, git]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-16-xcode-simulators-devices-git/
series:
  slug: zero-to-ios-hero
  order: 2
---

This is part 2 of the [Zero to iOS Hero series](../series/zero-to-ios-hero/).

An Xcode project becomes useful when you can answer four questions without guessing:

1. Which target produces the app?
2. Which scheme action are you running?
3. Which destination receives the product?
4. Which files belong in the next Git checkpoint?

The Run button sits on top of all four decisions. Learning the decisions keeps the button from becoming magic.

## The smallest useful installation

For this iOS path, install only what the first app needs:

- The current stable Xcode from the Mac App Store.
- iOS platform support.
- One current iOS Simulator runtime.
- Command Line Tools selected from that Xcode installation.

Skip watchOS, tvOS, visionOS, older iOS runtimes, and the optional Metal toolchain until a lesson uses them. Xcode's Components settings show installed components and the storage each removable component can recover.

The Mac App Store lists Xcode 26.6 as a 2.4 GB download. That number is not a complete disk budget. The installed application, separate Simulator runtime, temporary installation space, Derived Data, archives, and project builds need additional room.

After installing Xcode, select its developer directory and complete first-launch setup:

```bash
sudo xcode-select -s /Applications/Xcode.app/Contents/Developer
xcodebuild -runFirstLaunch
xcodebuild -version
swift --version
```

For this series baseline, the version checks should identify Xcode 26.6 and Swift 6.3.3. A later stable patch can replace that baseline after the support matrix is reviewed.

## Install one Simulator runtime

Open Xcode, choose Xcode > Settings > Components, and install the current iOS runtime. Xcode can also obtain it from the run-destination menu when an iOS project has no eligible runtime.

The command-line form is:

```bash
xcodebuild -downloadPlatform iOS
```

On Apple silicon, Xcode chooses the architecture-specific runtime by default to save space. Do not request the universal runtime unless another machine architecture needs the same exported package.

Inspect what Xcode can use:

```bash
xcrun simctl list runtimes
xcrun simctl list devices available
```

A runtime is the installed iOS system image. A simulated device combines that runtime with a device type and configuration.

## Create the project

Launch Xcode and choose File > New > Project. Select iOS, then App.

Use these starting values:

| Field | Value | Why |
| --- | --- | --- |
| Product name | Field Notes | The product readers build through the series |
| Team | Your personal or developer team | Needed later for a physical-device build |
| Organization identifier | `com.example.learning` | A placeholder that avoids using private account data |
| Interface | SwiftUI | The first interface path in the series |
| Language | Swift | The course language |
| Testing system | Swift Testing with UI tests where offered | Matches the later testing path |

Choose a folder you can identify from Terminal. If Xcode offers to create a Git repository, enable it for a new standalone project. In this repository, the companion project already lives inside the existing Git root, so a nested repository is not created.

## Read the project before editing

Select the blue project item in the Project navigator. The project editor separates project settings from target settings.

Find these facts:

- The app target's product name and bundle identifier.
- The iOS deployment target.
- The source files assigned to the app target.
- The test targets created by the template.
- The active scheme in the toolbar.
- The active run destination next to that scheme.

The project is a container. The app target is the build recipe. The scheme selects an action. The destination says where the built product runs.

## Replace the first screen

A minimal SwiftUI app can keep its root view in the application file:

```swift
import SwiftUI

@main
struct FieldNotesApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

struct ContentView: View {
    var body: some View {
        NavigationStack {
            ContentUnavailableView(
                "No Notes Yet",
                systemImage: "note.text",
                description: Text("Saved field notes will appear here.")
            )
            .navigationTitle("Field Notes")
        }
    }
}
```

This code claims Apple SDK behavior. Unlike the first post's `print` program, it imports SwiftUI and defines an application entry point. A browser Swift runner cannot validate it.

## Build before running

Product > Build asks the selected scheme to build without launching the app. Starting with Build separates compiler and linker failures from launch and runtime failures.

The command-line equivalent needs the project, scheme, and destination:

```bash
xcodebuild build \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -destination 'platform=iOS Simulator,name=<resolved device>,OS=26.5' \
  CODE_SIGNING_ALLOWED=NO
```

Do not copy the destination placeholder literally. Ask Xcode for eligible values:

```bash
xcodebuild \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -showdestinations
```

The visible name in the toolbar and the value accepted by `xcodebuild` come from the installed destination catalog.

## Run two simulated destinations

One successful Simulator run proves very little about adaptive layout. Use two destinations with a real difference in available width.

A useful first pair is:

- A current regular iPhone destination on the current iOS runtime.
- A compact iPhone destination on an installed supported runtime.

Resolve the exact names from `-showdestinations`, then build each one:

```bash
xcodebuild build \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -destination 'platform=iOS Simulator,name=<current iPhone>,OS=26.5' \
  CODE_SIGNING_ALLOWED=NO

xcodebuild build \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotes \
  -destination 'platform=iOS Simulator,name=<compact iPhone>,OS=<installed version>' \
  CODE_SIGNING_ALLOWED=NO
```

In Xcode, choose each destination and select Product > Run. Confirm the title and empty state remain readable. Rotate when the destination supports it and increase the simulated text size before treating the screen as done.

The two commands prove that the target builds for the named Simulator destinations. They do not prove physical-device performance, signing, sensors, background execution, or production distribution.

## Understand what Run adds

Product > Run performs more than Build:

```text
Resolve scheme
    |
    v
Build target dependencies
    |
    v
Assemble and sign the app for the destination
    |
    v
Install the product
    |
    v
Launch and attach the debugger
```

A build can pass while installation or launch fails. Keep the failed phase in the error report.

## Read the first useful diagnostic

Open the Issue navigator with Command-5 after a build error. Find the first diagnostic tied to code or configuration you own.

Common shapes point to different owners:

- **Swift compiler error**: Open the named source file and fix the first type or syntax problem.
- **Missing module**: Check the active SDK, target dependencies, and package resolution.
- **No eligible destination**: Check the scheme platform, installed runtime, and destination list.
- **Signing error**: Check the target's Signing & Capabilities pane and selected team.
- **Installation error**: Check device trust, Developer Mode, compatibility, and available storage.

Rebuild after the first fix. Later diagnostics often disappear with it.

## Derived Data is output, not source

Xcode places intermediate builds, indexes, logs, and other generated state in Derived Data. Those files can be deleted and rebuilt. They do not belong in Git.

Deleting Derived Data is reasonable when generated state is corrupt or stale. It is not a first response to every compiler error. A deterministic source or configuration failure returns after the cache is rebuilt.

Use Product > Clean Build Folder sparingly. Clean builds throw away incremental work and can hide whether the build graph is healthy.

## Run on a physical device

Simulator is not the final destination. Connect an iPhone, unlock it, and accept the trust prompts. Enable Developer Mode if the device requests it.

In Xcode:

1. Open Xcode > Settings > Apple Accounts and add a personal Apple Account or Developer Program account.
2. Select the app target, then Signing & Capabilities.
3. Leave automatic signing enabled for the first project.
4. Select the account's team.
5. Choose the connected iPhone as the run destination.
6. Select Product > Run.

Xcode can register the device and create a development provisioning profile for ordinary development when automatic signing is enabled. Some capabilities still require Developer Program membership, explicit App IDs, service configuration, or approved entitlements.

Record the device class and operating-system version without committing its unique identifier, team ID, certificate, or provisioning data.

## Put the checkpoint in Git

Git records source and configuration changes. It does not record whether a build passed unless the commit is paired with validation evidence.

From the project root:

```bash
git status --short
git diff --check
git add FieldNotes
git diff --cached
git commit -m "Create Field Notes app shell"
```

Review the staged diff before committing. The first checkpoint should contain source, project configuration, tests, and small assets needed to reproduce the build. It should not contain Derived Data, local user settings, signing identities, or build products.

A commit is local history. A push copies commits to a remote repository. Treat those as separate actions.

## The repository-shaped variant

The companion Field Notes workspace in this series declares its targets and schemes in `project.yml`, then generates the disposable Xcode project with XcodeGen. This keeps the source-of-truth diff readable while still producing normal Xcode targets.

```bash
xcodegen generate --spec project.yml
xcodebuild \
  -project FieldNotes.xcodeproj \
  -scheme FieldNotesSwiftUI \
  -showdestinations
```

The generated project is ignored. The declaration, app sources, package, tests, and evidence remain in Git.

This is a reproducibility choice, not a requirement for learning Xcode. A project created and maintained directly in Xcode is valid when its shared settings and schemes stay reviewable.

## Validation boundary for this checkpoint

The project creation, component installation, signing, Simulator, device, and Git steps in this post follow Apple's current Xcode documentation. This repository has not yet recorded the two named Xcode 26.6 Simulator builds or a signed physical-device run. Those evidence values remain Not verified until those destinations are available.

That gap does not turn a command-line Swift result into iOS evidence. It also does not block the next lesson from teaching a debugger workflow that works with the installed Swift toolchain.

## Checkpoint

Before moving on, you should be able to explain each line:

```text
Project contains targets.
Target produces a product.
Scheme chooses an action and configuration.
Destination supplies the runtime environment.
Build creates the product.
Run installs, launches, and debugs it.
Git records the reproducible source checkpoint.
```

The next post deliberately breaks a calculation, stops the process in LLDB, inspects the bad state, and verifies the correction.

## Series navigation

- Previous: [Part 1: The Apple development map](../2026-07-16-apple-development-map/)
- Next: [Part 3: How to learn by building and debugging](../2026-07-16-learning-by-building-debugging/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- **Project and build workflow**: Apple's current [project creation](https://developer.apple.com/documentation/xcode/creating-an-xcode-project-for-an-app), [target configuration](https://developer.apple.com/documentation/xcode/configuring-a-new-target-in-your-project), [scheme customization](https://developer.apple.com/documentation/xcode/customizing-the-build-schemes-for-a-project), and [build and run](https://developer.apple.com/documentation/xcode/building-and-running-an-app) guides define the project-to-process path.
- **Destinations and components**: Apple's [device and Simulator workflow](https://developer.apple.com/documentation/xcode/running-your-app-on-simulated-or-physical-devices) and [component manager](https://developer.apple.com/documentation/xcode/downloading-and-installing-additional-xcode-components) explain run destinations, platform support, physical-device setup, and separately installed runtimes.
- **Git in Xcode**: Apple's [source control management](https://developer.apple.com/documentation/xcode/source-control-management) and [branch and tag workflow](https://developer.apple.com/documentation/xcode/organizing-your-code-changes-with-source-control) place commits, branches, pushes, and tags in the Xcode workflow.
- **Current toolchain**: The [Xcode support matrix](https://developer.apple.com/support/xcode) and [Mac App Store listing](https://apps.apple.com/us/app/xcode/id497799835?mt=12) identify the current stable toolchain, host requirement, included SDKs, and listed download size.

## Related topics

- [Gitflow](../../topics/ops/gitflow/), a larger branching model to compare after the first local commit.
- [Testing](../../topics/testing/), the test distances attached to later Xcode schemes.
- [Swift coding problems](../../topics/cs/coding-problems/), language practice that does not require an Apple SDK.
