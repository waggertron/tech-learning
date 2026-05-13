---
title: "Hardware and software: Moore's Law and Wirth's Law"
description: "Why transistor counts doubled for 50 years, where that trajectory is now, and why software bloat consumed every hardware gain."
parent: technology-laws
tags: [hardware, performance, software-engineering, history]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two laws that shaped 50 years of software development. One governed how fast hardware improved. The other explains why users never noticed.

## Moore's Law

Origin: Gordon Moore, co-founder of Intel, "Cramming More Components onto Integrated Circuits," Electronics Magazine, 1965.

> The number of transistors on a chip doubles approximately every two years.

Moore originally said 12 months (1965), revised to 24 months (1975). The observation was empirical: Moore looked at the trend in integrated circuits from 1959 to 1965 and projected it forward. It held for 50 years.

### The historical data

| Year | Chip | Transistors |
| --- | --- | --- |
| 1971 | Intel 4004 | 2,300 |
| 1978 | Intel 8086 | 29,000 |
| 1989 | Intel 486 | 1,200,000 |
| 1997 | Intel Pentium II | 7,500,000 |
| 2006 | Intel Core 2 Duo | 291,000,000 |
| 2012 | Intel Ivy Bridge | 1,400,000,000 |
| 2020 | Apple M1 | 16,000,000,000 |
| 2023 | Apple M3 Pro | 37,000,000,000 |

Roughly doubling every 2 years from 1971 to roughly 2015, then slowing. The doubling rate has stretched to 2.5-3 years for leading-edge chips since around 2015.

### What the doubling enabled

Moore's Law wasn't just a fact about transistors. It was an engineering guarantee that reshaped software development.

**"Just wait 18 months"**: From roughly 1975 to 2005, if your software was too slow, the correct optimization was often to wait 18 months and run it on the next generation of hardware. This was not laziness. It was economically rational. Optimizing software takes developer time. Buying faster hardware was often cheaper. This reasoning produced an entire generation of software that was deliberately not optimized, because optimization was unnecessary. Moore's Law made it unnecessary.

**Single-threaded performance vs. multi-core**: Around 2004-2005, CPU clock speeds stopped scaling predictably. The physical limit of heat dissipation meant chip manufacturers could no longer just increase clock frequency to deliver Moore's doublings. They switched to multi-core: two slower cores instead of one fast one. More transistors, but they couldn't run faster. The "just wait for faster hardware" strategy stopped working for single-threaded code. Applications written for a single thread stopped benefiting from new hardware. Software had to be rewritten to use multiple cores, and Amdahl's Law meant many programs couldn't be parallelized enough to benefit.

**The AI training exception**: GPU transistor counts continued doubling longer than CPU transistor counts and at higher rates. The NVIDIA H100 has 80 billion transistors. AI training workloads are embarrassingly parallel (Amdahl's sequential fraction is tiny), so they benefit from GPU Moore's Law in a way most software cannot. This is one reason AI capability advances so rapidly: the hardware trajectory for the relevant workload has continued longer than the general-purpose CPU trajectory.

### Where Moore's Law stands now

The consensus among semiconductor engineers is that Moore's Law, as originally stated, has slowed significantly. From roughly 2015 onward, the doubling rate stretched to 2.5-3 years. Some foundries have continued advancing, but the industry cost per transistor stopped declining in the mid-2010s. The economic law (that you could budget on hardware getting cheaper on a predictable schedule) is effectively over, even if physical transistor counts continue to inch up.

**The implication for software engineers**: The "hardware will catch up" assumption is no longer reliable. Writing inefficient code and assuming it will run fast in 3 years is a worse bet than it was in 2003. Performance work that was optional for 30 years has become relevant again.

---

## Wirth's Law

Origin: Niklaus Wirth, creator of Pascal, "A Plea for Lean Software," IEEE Computer, 1995. Sometimes called "software bloat." Often summarized by Martin Reiser's observation and the saying attributed to Andy Grove: "What Intel giveth, Microsoft taketh away."

> Software gets slower faster than hardware gets faster.

Despite Moore's Law doubling hardware performance every two years, users have not noticed a continuous speedup in their software experience. Software complexity grows to consume available resources on roughly the same schedule.

### In-depth examples

**Word processors**: Microsoft Word 1.0 (1983) ran on a 4MHz processor with 128KB of RAM and was responsive. Word 2024 requires a minimum of 4GB RAM and a 1.6GHz processor. That is a 4,000x increase in RAM requirement and a 400x increase in clock speed requirement over 40 years. Moore's Law delivered roughly 2^20 (about 1,000,000x) improvement in transistors over the same period. The features added to Word do not justify a million-fold resource increase. The surplus hardware capacity was absorbed by layers of abstraction, UI frameworks, telemetry, background services, and plugin systems.

**Electron applications**: Electron embeds a full Chromium browser instance and a Node.js runtime into every desktop application. Slack uses Electron. Discord uses Electron. VS Code uses Electron. Each instance runs a multi-process browser architecture even for applications that are conceptually simpler than a web page from 2005. A Slack desktop app at idle uses roughly 300MB of RAM. The IRC client it replaced used under 1MB. The functionality is not 300x richer. The abstraction stack is 300x heavier.

**Web pages**: The median web page in 2010 was approximately 500KB. By 2024, the median web page is approximately 2.5MB: a 5x increase. The content per page has not grown 5x. The JavaScript framework size, analytics scripts, A/B testing scripts, chat widgets, and advertising SDKs grew. A user with the same internet connection from 2010 experiences the modern web as slower than they experienced the 2010 web, despite the hardware being much faster.

**Operating system boot times**: Windows XP on a 2001 Pentium 4 at 1.5GHz booted in approximately 30-45 seconds. Windows 11 on a 2024 processor at 4GHz boots in approximately 20-25 seconds. That's a 2-3x improvement in boot time for a 2,000x+ improvement in raw compute. Software complexity grew fast enough to consume almost all of the hardware gains.

### Why bloat happens

1. **Abstraction layers**: each layer of abstraction adds overhead. Web apps built on React on Next.js on Node.js on the OS are 5+ layers deep.
2. **Feature accretion**: features are added, almost never removed. Every feature has a runtime cost.
3. **Dependency creep**: `node_modules` for a simple project can contain hundreds of packages, each with their own overhead.
4. **Telemetry and monitoring**: applications that send usage data, crash reports, and analytics incur overhead on every run.
5. **Security mitigations**: Spectre/Meltdown mitigations added 5-30% overhead to system calls. Necessary, but costly.

### Where software has gotten faster

Specific domains with focused performance work have bucked the trend. Video codecs: AV1 delivers better quality at lower bitrate than H.264. Databases: PostgreSQL 16 is meaningfully faster than PostgreSQL 9 for many workloads. Compilers: Clang's optimization passes produce faster binaries than GCC did 20 years ago. These are cases where performance was an explicit goal and engineers chose not to spend the hardware gains on abstraction.

### Wirth's Law and Amdahl's Law together

Hardware gains (Moore's Law) hit Amdahl's ceiling for serial code anyway, so software bloat absorbing those gains is especially costly. The serial fractions of bloated software don't run faster even on new hardware if the bloat is in the serial path.

---

## References

- Moore, G. (1965). "Cramming More Components onto Integrated Circuits." *Electronics Magazine*, 38(8).
- Wirth, N. (1995). "A Plea for Lean Software." *IEEE Computer*, 28(2).
- Sutter, H. (2005). "The Free Lunch Is Over: A Fundamental Turn Toward Concurrency in Software." *Dr. Dobb's Journal*.
- Thompson, N. & Spanuth, S. (2021). "The Decline of Computers as a General Purpose Technology." *Communications of the ACM*, 64(3).

## Related topics

- [Performance math](./performance-math/): Amdahl's Law (ceiling on hardware speedup) and Little's Law
- [Network effects](./network-effects/): Metcalfe's Law (network value scaling vs. hardware scaling)
- [Scalability](../../../system-design/scalability/): what to do when hardware gains don't save you
