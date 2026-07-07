---
name: react-instructional-posts
description: "Use when creating, rewriting, or reviewing React learning posts in the tech-learning repo, especially Modern React series posts, to turn problem-first drafts into instructional concept guides grounded in official React docs, with terms, mental models, usage guidance, multiple examples, pitfalls, references, and series navigation."
---

# React Instructional Posts

Use this skill with `authoring`, `writing-style`, `prose-cleanup`, and `post-series` when the work touches React posts in `src/content/docs/posts/`.

## Workflow

1. Read the target post, the series landing page, and the neighboring posts in the reading order.
2. Preserve the filename, canonical URL, date, tags, and `series.slug` plus `series.order` unless the user explicitly asks to restructure the series.
3. Refresh official docs before making claims about React APIs, current framework guidance, Server Components, Actions, Compiler behavior, or recommended tooling.
4. Read `references/react-docs-map.md` when choosing React docs links, mental models, or post-specific teaching anchors.
5. Rewrite the post as an instructional concept guide. Do not keep a problem-first structure.
6. Run the repo scans and `npm run build` after a batch of React post edits.

## Post Shape

Use this structure unless the existing series has a stronger local pattern:

```markdown
<Series intro sentence.>

<Positive concept introduction. Name the concept and what it lets the reader build.>

## Concept

<Define the concept in React terms.>

## Terms

- **Term**: Direct definition.
- **Term**: Direct definition.

## Mental model

<One concrete model for how to think about the concept.>

## How it is used

<Where the concept appears in real React applications.>

## How to use it

1. <Actionable step.>
2. <Actionable step.>
3. <Actionable step.>

## Example: <specific use>

```tsx
<working TypeScript or TSX example>
```

## Example: <second specific use>

```tsx
<another example that teaches a different use>
```

## Details to watch

- **Boundary**: Pitfall or constraint stated as a practical boundary.

## Series navigation

## References

## Related topics
```

## Voice Rules

- Teach the positive model first. Start from what the concept is and what it enables.
- Avoid headings named `Problem`, `Solution`, `Wrong first move`, or `The fix`.
- Use `Details to watch` for pitfalls. Describe boundaries, timing rules, serialization rules, rendering rules, or framework constraints without scolding the reader.
- Explain acronyms and initialisms on first use when they are not obvious to a web developer, for example RSC, SSR, SSG, CSR, SPA, DOM, API, and CI.
- Prefer React's own vocabulary: component, prop, state, render, commit, Effect, Hook, Action, Transition, Suspense boundary, Server Component, Client Component.
- Include a mental model for every post. Make it specific enough that the reader can use it while coding.
- Keep examples practical and small. More than one example is expected when a concept has multiple common uses.
- Use official React docs as the primary source for React behavior. Use framework docs only for framework-specific posts.

## Copy Quality Gate

Before calling a React post done, check it against these standards:

- **Unique copy**: The post cannot read like a template filled with a different title. Its introduction, mental model, examples, and details must be specific to the concept.
- **Topic explanation**: The post explains what the topic is, how it fits into React, and how a developer uses it in an application.
- **Necessary definitions**: Terms, acronyms, API names, and framework labels are defined before they carry the explanation.
- **Useful examples**: Examples show different characteristics or common uses of the concept. Do not add a second example that only renames the first.
- **Practical characteristics**: The post names the concept's boundaries, lifecycle, data flow, ownership model, or runtime behavior when those details affect real code.
- **Learning value**: A reader should leave knowing what the item is, when to reach for it, how to start using it, and what details deserve attention.

## React Teaching Rules

- **Components and JSX**: Present components as functions that return UI. Tie JSX to JavaScript expressions and data display.
- **Props and children**: Teach one-way data flow from parent to child. Treat `children` as composition, not a special escape hatch.
- **State**: Teach state as the minimal changing memory needed for rendering. Derived values are usually calculated during render.
- **Events**: Event handlers describe user intent. Pass handlers instead of calling them during render.
- **Reducers**: Use reducers when related transitions are easier to read as named actions. Reducers for `useReducer` stay pure.
- **Context**: Use context for values that many descendants need. Pair context with local providers and small custom hooks.
- **Refs**: Use refs for values that do not affect rendering, or for DOM access. Keep render output driven by props and state.
- **Effects**: Teach Effects as synchronization with external systems. Do not use Effects to transform render data or handle user events.
- **Custom Hooks**: Extract reusable stateful logic, not random helper functions. Custom Hooks follow the Rules of Hooks.
- **Suspense and lazy**: Teach boundaries as loading coordination points. Pair lazy code loading with Suspense fallbacks.
- **Transitions**: Teach Transitions as background rendering for non-urgent updates. Controlled text input updates stay urgent.
- **Actions and forms**: Distinguish Actions, `useActionState`, `useOptimistic`, and `useFormStatus`. Explain where form state lives.
- **Server Components**: Distinguish Server Components, Client Components, Server Functions, `"use client"`, and `"use server"`. Do not call Server Components `"use server"` components.
- **Compiler and performance**: Teach purity first, measurement second, manual memoization third. Mention that React Compiler handles memoization for many cases when enabled.
- **Frameworks**: Follow React docs guidance that most production apps start with a framework. For scratch apps, explain the extra choices: routing, data fetching, code splitting, styling, and rendering strategy.

## Validation

Run these checks before finalizing a batch:

```bash
rg -n "## Problem|Wrong first move|The fix|problem and solution" src/content/docs/posts/2026-07-07-react-*.md
rg -n $'\u2014' src/content/docs/posts/2026-07-07-react-*.md .agents/skills/react-instructional-posts
rg -n "\\*\\*[^*]+\\*\\*," src/content/docs/posts/2026-07-07-react-*.md .agents/skills/react-instructional-posts
npm run build
```

Run the anti-filler vocabulary scan from `writing-style` or `prose-cleanup` as a separate pass when prose changed.
