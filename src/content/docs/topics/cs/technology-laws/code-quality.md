---
title: "Code quality: Kernighan's Law and the Law of Demeter"
description: "Why clever code is dangerous, and why objects should only talk to their immediate neighbors."
parent: technology-laws
tags: [software-engineering, code-quality, refactoring, design-patterns]
status: draft
created: 2026-05-13
updated: 2026-05-13
---

Two principles that apply at different scales. Kernighan's Law operates at the level of individual expressions and functions. The Law of Demeter operates at the level of object relationships and module boundaries. Both have the same root concern: code that is hard to reason about is code that will break in ways you can't predict.

## Kernighan's Law

Origin: Brian Kernighan, from "The Elements of Programming Style" (2nd ed., 1978), co-authored with P.J. Plauger. The specific phrasing most often quoted is commonly attributed to Kernighan.

> Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are not smart enough to debug it.

The argument: write code at the ceiling of your ability and you've used up all your capacity just writing it. Debugging requires understanding existing code under pressure, often in an unfamiliar context, often at 2am during an incident. If you needed 100% of your capacity to write it, you have 0% left to debug it.

**Example 1: The clever regex**

A developer writes a single regular expression to validate, extract, and transform an email address:

```python
# Clever: one expression, "elegant"
result = re.sub(r'^([^@]+)@((?:[a-z0-9-]+\.)*[a-z0-9-]+\.[a-z]{2,})$',
                lambda m: f"{m.group(1).lower()}@{m.group(2)}",
                email.strip()) if re.match(r'^[^@\s]+@[^@\s]+\.[^@\s]+$', email) else None
```

Six months later, this fails silently for emails with plus signs (`user+tag@example.com`). The developer who debugs it (possibly not the original author) needs to mentally parse two nested regex patterns, a lambda with group references, a ternary, and `.strip()`. The bug is in the character class `[^@\s]` not including `+`.

The readable version:

```python
def normalize_email(email):
    email = email.strip()
    if "@" not in email:
        return None
    local, _, domain = email.partition("@")
    if not domain or "." not in domain:
        return None
    return f"{local.lower()}@{domain}"
```

Longer. Obvious. The bug would be immediately visible. The clever version saved 5 lines. The readable version costs minutes to debug instead of hours.

**Example 2: Bit manipulation tricks**

A developer optimizes integer operations using bit tricks:

```python
# Check if n is a power of 2
is_power_of_2 = n and not (n & (n - 1))

# Swap two integers without a temp variable
a ^= b; b ^= a; a ^= b

# Count set bits
count = 0
while n:
    n &= n - 1
    count += 1
```

Each of these is correct. Each is significantly harder to read than its naive equivalent. Under normal circumstances, the naive equivalent is fast enough. In the rare case where it isn't, profiling data should justify the trick. Clever bit manipulation written speculatively is a maintenance tax on every future developer who reads the code, including the author six months later.

**Example 3: One-liner chaining**

Python encourages expressive one-liners. Some developers take it too far:

```python
# Clever one-liner
result = {k: sum(v for v in vals if v > 0) / len([v for v in vals if v > 0]) 
          for k, vals in data.items() if any(v > 0 for v in vals)}
```

This computes the mean of positive values per key, skipping keys with no positive values. The bug: `len([v for v in vals if v > 0])` iterates through `vals` a second time inside what already looks like a single-pass operation. For large `vals`, this is unexpectedly $O(n)$ twice. More importantly, when this raises a `ZeroDivisionError` because some edge case wasn't handled, the traceback points to this one line. There is no way to inspect intermediate values without rewriting the expression.

The readable version: three lines, three variables (`positives`, `total`, `count`). The bug surfaces immediately. The fix is one line.

**Kernighan's Law applied in code review**:

- A piece of code that requires a comment explaining what it does is a smell.
- A piece of code that requires a comment explaining how it does it is a larger smell.
- The question to ask of any clever code: "If this fails at 3am, will the on-call engineer understand it in 5 minutes without context?" If the answer is no, rewrite it.

**The counterexample**: Kernighan's Law applies to gratuitous cleverness. There is code that is inherently complex because the problem is complex. A topological sort, a B-tree insertion, a JWT signature verification -- these are complex because they must be. Document them. Test them well. Don't simplify them past correctness. The law applies to cleverness that obscures simple things, not to complexity that reflects real problem difficulty.

---

## The Law of Demeter

Origin: Karl Lieberherr et al., Northeastern University, 1987. Named after the Demeter Project at the university.

> A unit should only talk to its immediate friends. Don't talk to strangers.

More formally, a method `M` of an object `O` may only call methods of:

1. `O` itself
2. Parameters passed to `M`
3. Objects created or instantiated within `M`
4. `O`'s direct attributes
5. Global variables (in languages that have them, and only if necessary)

It may not call methods on objects returned by those calls (with some nuance).

**Example 1: The train wreck**

The Law of Demeter violation is often called a "train wreck":

```python
# Violation: reaching through multiple objects
city = order.get_customer().get_address().get_city()

# Compliant: ask the object you know for what you need
city = order.get_shipping_city()
```

The first form couples the caller to three classes: `Order`, `Customer`, and `Address`. If `Address` is refactored to use a `Location` object internally, or if `Customer` is replaced with `Buyer`, the caller breaks even though the data (city) still exists. The second form couples the caller only to `Order`. The chain is hidden inside `Order.get_shipping_city()`, where it belongs.

**Example 2: Testing reveals the coupling**

The train wreck form is difficult to test because you must construct a full chain of objects to get a valid `order`:

```python
# Test setup with train wreck code
address = Address(city="Seattle")
customer = Customer(address=address)
order = Order(customer=customer)
assert get_city_from_order(order) == "Seattle"
```

The Demeter-compliant version:

```python
# Test setup with Demeter-compliant code
order = Order(shipping_city="Seattle")
assert order.get_shipping_city() == "Seattle"
```

The second test only knows about `Order`. It does not need to know how `Order` stores the city internally. If the internal representation changes, the test does not change. This is the practical benefit: Demeter compliance produces code that is easier to test because test setup is simpler and tests are less brittle.

**Example 3: The Django view that queries through relations**

```python
# Violation
def order_view(request, order_id):
    order = Order.objects.get(id=order_id)
    city = order.customer.address.city          # two SQL queries, full object graph
    warehouse = order.shipment.warehouse.address.city  # three more queries
```

```python
# Demeter-compliant: get what you need from Order directly
def order_view(request, order_id):
    order = Order.objects.select_related(
        'customer__address', 'shipment__warehouse__address'
    ).get(id=order_id)
    customer_city = order.shipping_city()     # method on Order
    warehouse_city = order.warehouse_city()   # method on Order
```

Beyond Demeter compliance, the second form is also one SQL query instead of five. The view only knows `Order`. Everything else is `Order`'s concern.

**Example 4: The microservice equivalent**

Demeter's Law applies at the service level too. A service that must call service A to get an ID, then call service B with that ID to get data, then call service C with that data to complete an operation is a distributed train wreck. Each hop creates coupling and latency. The Demeter-compliant version: the service that knows the answer computes it and exposes it directly.

**Where Demeter gets complicated**:

Not all chaining violates Demeter. Builder patterns and fluent interfaces chain on the same object:

```python
query = (Query.builder()
              .from_table("users")
              .where("active", True)
              .order_by("name")
              .build())
```

Each call returns `self` or a builder object (same conceptual type). This is not a Demeter violation. You're talking to one object, not reaching through multiple domains.

**The counting heuristic**: Count the dots in a method call chain. One dot: fine. Two dots on different types: look closely. Three or more dots on different types: almost certainly a Demeter violation.

---

## How the two principles connect

Kernighan's Law says: don't be clever about individual expressions. Demeter says: don't reach across object boundaries. Both create the same failure mode when violated. The resulting code is hard to debug (Kernighan) and hard to change without ripple effects (Demeter). Both push toward the same remedy: write code that exposes only what it needs to expose, and requires only what it needs to require.

---

## References

- Kernighan, B.W. & Plauger, P.J. (1978). *The Elements of Programming Style* (2nd ed.). McGraw-Hill.
- Lieberherr, K. et al. (1989). "Object-Oriented Programming: An Objective Sense of Style." OOPSLA 1988 Proceedings.
- Lieberherr, K. & Holland, I. (1989). "Assuring Good Style for Object-Oriented Programs." *IEEE Software*, 6(5).

## Related topics

- [Systems thinking laws](../systems-thinking/): Leaky Abstractions and Chesterton's Fence
- [API design laws](../api-design/): Hyrum's Law, Postel's Law, and POLA
- [Team dynamics](../team-dynamics/): Conway's Law, org structure shapes code structure
