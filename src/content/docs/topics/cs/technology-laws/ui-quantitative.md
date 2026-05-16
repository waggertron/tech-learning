---
title: "UI quantitative laws: Fitts's Law and Hick's Law"
description: "The two formulas that predict interaction time from target size and choice count, and what they mean for interface design."
parent: technology-laws
tags: [ux, ui, human-computer-interaction, design]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two formulas from mid-century psychology that quietly govern every interface you've ever used. One predicts how long it takes to move to a target. The other predicts how long it takes to choose between options.

## Fitts's Law

Origin: Paul Fitts, 1954, "The information capacity of the human motor system in controlling the amplitude of movement." *Psychological Review*.

> The time to acquire a target is a function of the distance to the target and the size of the target.

**The formula**: T = a + b * log2(2D/W)

Where:

- T = movement time
- a and b = empirically fitted constants (device and context dependent)
- D = distance from starting point to target center
- W = width of the target along the movement axis

The log2(2D/W) term is the "index of difficulty" (ID). It captures the ratio of how far you have to move to how big the target is. Double the distance, add about one bit of difficulty. Double the target size, subtract about one bit of difficulty.

**Screen corners have infinite effective size**: The corners of a screen are special under Fitts's Law. A user clicking toward the top-left corner can move the mouse as fast and carelessly as they want: the cursor stops at the corner. The corner's effective target width in Fitts's terms is infinite -- you can't overshoot it. This is why macOS puts the Apple menu and the close button at corners and edges. Corners are the fastest targets on screen. Windows had the Start button in the bottom-left corner for the same reason.

**Apple's 44pt minimum touch target**: Apple's Human Interface Guidelines specify a minimum touch target size of 44x44 points. The reasoning is Fitts's Law applied to fingers: fingers are less precise pointing devices than mice. A small target requires more time and more corrective movements. 44pt is the empirically derived size where miss rates become acceptably low for average adult fingers. Android's Material Design uses 48dp for the same reason. The formula is the reason, not aesthetics.

**Menu bar vs context menu**: The macOS menu bar sits at the absolute top edge of the screen. Moving the mouse upward, you can slam it into the top edge at full speed. The effective height of the menu bar is infinite. A context menu floating in the middle of the screen has finite, small targets. This is why the menu bar, despite requiring more mouse travel than a context menu, can be faster to use for practiced users. Fitts's Law explains the paradox.

**Pie menus are faster than linear menus**: A pie menu puts options in a circle around the cursor. Every option is the same distance away (small D). Linear menus require scanning down a list, where later items have higher D. Pie menus with 8 options have been measured to be 2-3x faster than equivalent linear menus for experienced users. The formula predicts this: uniform distance plus generous target wedges equals a low index of difficulty for all options.

**Button placement in forms**: A submit button placed far from the last form field (high D) takes longer to reach than one placed immediately below. This sounds obvious, but Fitts's Law quantifies it. It also explains why mobile forms that shift the submit button off-screen as the keyboard appears create a measurable usability penalty.

**What Fitts's Law does not cover**:

- Accuracy under time pressure (Fitts assumes you're trying to be accurate)
- Touch targets that require 2D precision (the formula models 1D movement)
- Cognitive load of deciding which target to aim for (that's Hick's Law)

---

## Hick's Law

Origin: William Edmund Hick, 1952, "On the rate of gain of information." *Quarterly Journal of Experimental Psychology*.

> Decision time increases logarithmically with the number of choices.

**The formula**: T = b * log2(n + 1)

Where:

- T = reaction/decision time
- b = empirically fitted constant
- n = number of equally probable choices

The +1 accounts for the "no-action" option. You always have the choice of doing nothing.

**Navigation menus**: A top navigation bar with 12 items takes measurably longer to scan than one with 6 items. The increase is logarithmic, not linear. 12 items is not twice as slow as 6 items, but it is slower. The widely cited "7 plus or minus 2" rule (Miller's Law) comes from a different domain (working memory chunks), but it aligns roughly with what Hick's Law predicts for navigation: past roughly 7 options, decision time grows fast enough to degrade UX.

**iOS vs Android home screen philosophy**: Early iOS had a strict grid of app icons -- maximum information density, many choices per screen. The design pressure was to put commonly used apps on the first screen to reduce search time. Android's widget-heavy home screen can have more varied layouts. Hick's Law doesn't say one is better, but it explains why the choice of what to put on page 1 vs page 2 has a real performance impact: reducing the choice set that a user scans first directly reduces decision time.

**Onboarding flows**: A signup flow that presents 8 options on the first screen (account type, industry, team size, use case, integrations) performs worse than one that presents 2-3 choices per step, even if both collect the same data total. The multi-step flow applies Hick's Law: each decision has few options, so each decision is fast. The single-screen version forces the user to cognitively process all options simultaneously.

**TV remotes vs streaming interfaces**: A traditional TV remote has 40+ buttons. A Roku remote has 20. An Apple TV remote has 8 meaningful controls. Each reduction cuts decision time for common tasks. The trade-off is expressiveness: the 8-button remote can't access every function quickly (you navigate menus instead), but for the 90% case (play, pause, volume, home) it's faster. Hick's Law explains the Roku and Apple TV design philosophy.

**Error messages with options**: An error dialog that says "Would you like to retry, cancel, or try a different approach?" is slower to act on than one that says "Retry?" with a dismiss option. When users are under stress (something failed), decision time matters more, not less. Reducing options in error dialogs is directly motivated by Hick's Law.

**What Hick's Law does not cover**:

- The time to physically acquire a target after deciding (that's Fitts's Law)
- Choices where options are not equally probable (the log formula assumes uniform probability; skilled users with habitual choices can approach $O(1)$ response time through pattern matching)
- Choices with search aids (search boxes override Hick's Law)

---

## How the two laws work together

Fitts's Law governs the physical acquisition: how long to move to a target once you've decided to click it. Hick's Law governs the cognitive selection: how long to decide which target to aim for. Good interface design minimizes both. Bad interface design maximizes both.

Every UI decision sits somewhere on both axes. A toolbar with 20 small, evenly spaced icons is slow on both dimensions. A large primary action button below a short options list (2-3 items) is fast on both.

---

## References

- Fitts, P.M. (1954). "The information capacity of the human motor system in controlling the amplitude of movement." *Psychological Review*, 61(6).
- Hick, W.E. (1952). "On the rate of gain of information." *Quarterly Journal of Experimental Psychology*, 4(1).
- MacKenzie, I.S. (1992). "Fitts' Law as a research and design tool in human-computer interaction." *Human-Computer Interaction*, 7(1).
- Apple Human Interface Guidelines: Targets. developer.apple.com.

## Related topics

- [API design laws](./api-design/): POLA, the Principle of Least Astonishment (behavioral counterpart)
- [Team dynamics](./team-dynamics/): Conway's Law and Brooks's Law
