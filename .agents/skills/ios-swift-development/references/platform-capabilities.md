# Apple Platform Capabilities Reference

Reviewed on 2026-07-13. Use before teaching a framework that touches protected data, device hardware, app services, background execution, extensions, signing, or distribution.

## Capability Audit

For each feature, record:

1. Supported platforms and minimum operating-system versions.
2. Required framework imports and target types.
3. Information property list keys and localized purpose strings.
4. Target capabilities and entitlements.
5. Apple Developer Program, App Store Connect, server, or entitlement-request setup.
6. Simulator behavior and physical-device requirements.
7. Authorization states, denial behavior, settings return, and restricted accounts.
8. Local or in-memory substitute for automated tests.
9. Data handling, retention, privacy manifest, and App Review consequences.

## Boundary Types

- **Permission**: Runtime user consent for protected data or services. The app needs a clear purpose string and denial path.
- **Capability**: Xcode target configuration that may add entitlements, frameworks, or signing changes.
- **Entitlement**: A signed key-value right granted to an executable. Some require Apple approval or account configuration.
- **Account service**: Developer portal or App Store Connect setup, such as CloudKit containers, In-App Purchase products, or push keys.
- **Device requirement**: Hardware or operating-system behavior a simulator cannot prove.

## Common Evidence Boundaries

| Surface | Local or simulator evidence | Physical or account evidence |
| --- | --- | --- |
| Photos and camera | Picker flow and denied state | Camera capture and real library behavior |
| Location | Injected coordinates and simulator route | Accuracy, authorization changes, and background behavior |
| Notifications | Scheduling logic and local notification UI | Remote delivery, token lifecycle, and service configuration |
| CloudKit | In-memory sync contract and error fixtures | Containers, entitlements, account states, and network behavior |
| Background work | Scheduling policy and expiration handlers | Actual launch opportunities, power, thermal, and timing behavior |
| StoreKit | StoreKit configuration and local transactions | Sandbox account, server notifications, and App Store Connect setup |
| Biometrics | Policy and failure mapping | Enrolled Face ID or Touch ID behavior |
| Health, Home, family, or network extensions | Contract tests and denial states | Restricted entitlements, real data, and supported devices |

## Implementation Rules

- Request the least access needed and request it near the user action that explains why.
- Read the current authorization state before deciding which UI to show.
- Handle denied, restricted, limited, not determined, unavailable, and revoked states where the framework exposes them.
- Do not put developer account identifiers, signing values, or real service credentials in examples.
- Keep cloud and hardware adapters outside domain behavior. Provide a local path for automated learning and tests.
- State when a sample cannot exercise the real capability without enrollment, approval, a server, or a physical device.

## Primary Sources

- [Adding capabilities to an app](https://developer.apple.com/documentation/xcode/adding-capabilities-to-your-app)
- [Entitlements](https://developer.apple.com/documentation/bundleresources/entitlements)
- [Protected resources](https://developer.apple.com/documentation/bundleresources/information_property_list/protected_resources)
- [Technology overviews](https://developer.apple.com/documentation/technology-overviews)
- [App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
