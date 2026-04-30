---
title: Composition over inheritance, the advice that actually earns its keep
description: 'Favor composition over inheritance is a Gang-of-Four line that has aged well. Why inheritance goes wrong, what composition looks like in practice, and the narrow cases where inheritance still deserves a seat.'
date: 2026-04-24
tags: [design, oop, composition, inheritance, architecture]
crosspost: [devto, linkedin]
canonical: https://waggertron.github.io/tech-learning/posts/2026-04-24-composition-over-inheritance/
---

## The one-line version

**When you're tempted to inherit from a class to reuse its behavior, instead hold an instance of that class as a field.**

That's it. The rest is elaboration.

## Where the advice came from

The Gang of Four's 1994 *Design Patterns* had it as an explicit principle: *"Favor object composition over class inheritance."* Every pattern in the book uses composition; the ones that use inheritance do so narrowly. Thirty years later the advice has only gotten stronger because frameworks learned the same lesson independently, React, Rust's trait system, Go's struct embedding, all treat inheritance as either absent or heavily constrained.

## Why inheritance goes wrong

Inheritance looks cheap: `class Truck extends Vehicle` and you get `start()`, `stop()`, `fuelLevel` for free. The problems show up months later.

### 1. Tight coupling to the base class

`Truck` now depends on every public method and protected field of `Vehicle`. Change `Vehicle`'s `start()`, even just to add a log line, and `Truck` has to be regression-tested. The parent-child relationship is the most coupled one the language offers.

### 2. The fragile base class problem

A small change to `Vehicle.stop()` breaks five unrelated `Truck.stop()` overrides. The pattern: a parent updates a method, every subclass's override reacts badly because the override assumed the old behavior.

### 3. Deep hierarchies are untraversable

`PickupTruck extends DieselTruck extends Truck extends CombustionVehicle extends Vehicle`. Finding where `accelerate()` is actually implemented requires walking five files. Any call site has to reason about MRO / virtual dispatch.

### 4. Single inheritance forces picking

You want a `SoundsLikeATruck extends SoundsLike` and a `MovesLikeATruck extends MoveBehavior`. Most languages force you to pick one parent. Multiple inheritance (Python, C++) solves that and introduces diamonds and MRO confusion.

### 5. It encodes "is-a" where "has-a" is more honest

A `Circle extends Shape` says a Circle *is* a Shape. A `Circle` that holds a `ShapeRenderer` and a `ShapeBounds` says a Circle *has* rendering and bounds. The latter is usually closer to how the code actually works.

## What composition looks like

### Refactoring inheritance to composition

Before:

```python
class Animal:
    def __init__(self, name):
        self.name = name

    def speak(self):
        raise NotImplementedError

class Dog(Animal):
    def speak(self):
        return "Woof"

class Cat(Animal):
    def speak(self):
        return "Meow"
```

After:

```python
class Animal:
    def __init__(self, name, voice):
        self.name = name
        self.voice = voice

    def speak(self):
        return self.voice.sound()

class BarkVoice:
    def sound(self):
        return "Woof"

class MeowVoice:
    def sound(self):
        return "Meow"

dog = Animal("Rex", BarkVoice())
cat = Animal("Mittens", MeowVoice())
```

Before: `Dog` and `Cat` are types. After: `Animal` is a type; voice is a field. You can:

- Add a new voice without touching `Animal`.
- Swap a voice at runtime (`dog.voice = MeowVoice()`, weird but possible).
- Test `Animal` with a fake voice.
- Compose voices (`OverlaidVoice(BarkVoice(), MeowVoice())`).

### The Strategy pattern as a motif

Anywhere you'd use `if` or a subclass, consider a strategy object:

```ts
interface SortStrategy<T> {
  sort(items: T[]): T[];
}

class QuickSort<T> implements SortStrategy<T> { ... }
class MergeSort<T> implements SortStrategy<T> { ... }

class List<T> {
  constructor(private items: T[], private sorter: SortStrategy<T>) {}
  sorted() { return this.sorter.sort(this.items); }
}
```

Subclass-proliferation disease cured. Adding a new sort is adding a class, not carving up a hierarchy.

### Mixins and traits

Some language communities embrace composition via traits (Rust), mixins (Ruby), or interfaces with default methods (Java, Kotlin, Python). Each is "compose a set of behaviors into a type" without an is-a relationship.

Rust's `impl Iterator for MyType { ... }` is pure composition, `MyType` doesn't "inherit" anything; it implements a trait.

### The Decorator pattern

When you'd override a method to extend it, wrap instead:

```python
class LoggingReader:
    def __init__(self, inner):
        self.inner = inner

    def read(self, n):
        data = self.inner.read(n)
        logger.info(f"read {len(data)} bytes")
        return data

plain = FileReader("in.txt")
logged = LoggingReader(plain)
cached = CachingReader(logged)
```

Three behaviors stacked without a class hierarchy. Remove one by unwrapping. Add a fourth by writing a new class that wraps.

## When inheritance is still the right tool

Not every use of `extends` is a mistake. Cases where inheritance earns its keep:

### 1. Framework base classes you don't own

`class MyView extends React.Component`. Django's `class Meta`. FastAPI's `BaseModel`. These are explicitly designed to be inherited from; the framework assumes inheritance as the extension mechanism.

### 2. Shared mechanical concerns across genuinely related types

An `AbstractTenantScopedModel` with common audit fields (`created_at`, `updated_at`, `tenant_id`) really is "all tenant-scoped models are variants of this." That's is-a.

### 3. When language features are only available via inheritance

In some languages (Java before default methods; older Python), there's no other way to share implementation.

### 4. Performance, zero-overhead abstraction

Virtual dispatch via inheritance is sometimes cheaper than composition's indirection. Rare; don't optimize prematurely.

## The "rule" most teams need

- **First choice:** composition. Hold an instance.
- **Second choice:** an interface / protocol / trait / mixin.
- **Third choice:** inheritance, only for genuine is-a relationships, with a shallow hierarchy (< 3 deep), from a base class you control.

If your design doc says "X extends Y" and you can't name a genuine is-a relationship, change it to composition.

## Real-world cases

### React

React moved from mixins (early) to class inheritance (`React.Component`) to hooks (composition of pure functions). Each step pushed toward composition. The hook story is explicit, "compose behaviors", and has produced more readable, testable, reusable code than the class-based approach.

### Django models

Django models inherit from `models.Model`, but the community has consistently favored **composition over inheritance within your own domain**. Django's abstract base classes are widely used; deep custom hierarchies aren't.

### Go

Go has no class inheritance at all. Struct embedding is composition with sugar. Interfaces are satisfied structurally. Go programmers live without inheritance and notice its absence less than newcomers expect.

### Rust

Rust explicitly rejects inheritance. Traits + generics + composition + impl blocks replace everything a class hierarchy would have done. Large Rust codebases are, on average, more pleasant to navigate than large Java ones.

## Common mistakes

- **"I need three specific subclasses; I'll inherit."** Three strategies in a field works better, with room for a fourth.
- **Reaching for template method.** Template method (abstract hook in a parent, override in children) is a classic inheritance use; a callback or strategy often replaces it more cleanly.
- **Chasing DRY by extracting base classes.** Extract shared functions or shared fields; avoid extracting a base class just to dedupe four lines.
- **Making every collaborator inject-able.** Every field as a constructor parameter is over-engineering for simple code. Compose the pieces that vary; concrete-instantiate the ones that don't.
- **Prefer composition dogmatically in frameworks that expect inheritance.** Fighting React (pre-hooks), Rails, or Django by refusing to inherit the framework's base classes leads to worse code. Use the framework's idiom.

## A shorthand for code review

When you see `extends` or `: BaseClass`, ask:

1. Is this a genuine is-a relationship? Or a reuse-of-implementation relationship?
2. Could this be a field (composition) instead?
3. Could it be a trait / interface / protocol?
4. If it stays as inheritance, is the hierarchy shallow (< 3)?
5. Is the base class stable enough that it won't change under us?

If most answers point away from inheritance, refactor. If most point toward, leave it.

## References

- [Gang of Four, *Design Patterns*](https://www.oreilly.com/library/view/design-patterns-elements/0201633612/), where the advice is first formalized
- [Sandi Metz, *Practical Object-Oriented Design in Ruby*](https://www.poodr.com/), spends a chapter on why composition wins
- [Brian Goetz, *The Good, the Bad, and the Ugly of Inheritance* (JVMLS 2017)](https://www.youtube.com/watch?v=Bte6xqLZ-Ss), senior Java architect on why modern JVM design prefers composition
- [Steve Yegge, *Execution in the Kingdom of Nouns*](https://steve-yegge.blogspot.com/2006/03/execution-in-kingdom-of-nouns.html), the critique of Java's forced-OO design
- [Joe Armstrong (Erlang), *Why OO sucks*](https://wiki.c2.com/?ArgumentsAgainstOop), the more radical position

## Related topics and posts

- [SOLID principles](../2026-04-24-solid-principles/), LSP and OCP are deeply tied to this choice
- [Functional Core, Imperative Shell](../../topics/cs/functional-core-imperative-shell/), composition writ large
