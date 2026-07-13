---
title: "Case Study: Notification System"
description: "Full system design walkthrough for a multi-channel notification system: push, email, and SMS delivery, priority queues, per-user rate limiting, deduplication, and why the notification path must never block the main request."
parent: case-studies
tags: [system-design, case-studies, interviews, notifications]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

A notification system is a classic fan-out problem: one event triggers one or many notifications to one or many users across one or many channels. It appears as a standalone interview question and as a component in nearly every other [system design](../) (social feed, ride sharing, e-commerce). The interesting design decisions are around priority (OTPs must arrive in seconds, marketing emails can wait hours), channel selection (which channel to use for which user under which circumstances), and correctness (a duplicated OTP is a security problem, while a duplicated marketing email is just annoying).

## Clarifying questions

- **Channels**: push (iOS + Android), email, SMS, in-app? Which are required?
- **Event types**: transactional (order confirmed, payment received) or marketing (weekly digest, promotion)?
- **Priority**: must all notifications arrive with the same urgency?
- **User preferences**: can users opt out per channel per event type?
- **Volume**: how many notifications per day?
- **Deduplication**: what is the cost of a duplicate notification? (OTP duplicate = security risk; marketing duplicate = annoyance)

What the answers reveal:
- SMS is expensive ($0.01-0.10 per message) -- must be reserved for critical events
- Transactional vs marketing events need separate queues with different SLAs
- User preference lookups are on the hot path -- must be cached aggressively

For this walkthrough: push (iOS + Android), email, SMS for critical events only; transactional and marketing notifications; user opt-out preferences; 1B notifications/day total.

## Estimation

```
Total volume: 1B notifications/day
  Push: 700M/day (most common, cheapest)
  Email: 250M/day
  SMS: 50M/day (critical only)

Push QPS:
  700M / 86,400 = 8,100/sec
  FCM batch API: 1,000 recipients per call = 8.1 FCM calls/sec (trivial)

Email QPS:
  250M / 86,400 = 2,900/sec
  ESPs (SendGrid, SES): rate limit varies; use multiple API keys / accounts

SMS:
  50M / 86,400 = 578/sec
  At $0.01/SMS = $500K/day -- confirm this is intentional

Storage (notification history, 30-day retention):
  1B/day * 200 bytes/record * 30 days = 6 TB
```

**Channel constraint**: push is high volume but cheap. SMS is low volume but expensive -- confirm with the interviewer that the 50M/day volume is correct before designing for it. Email throughput (2,900/sec) requires multiple ESP accounts to stay within rate limits.

## High-level design

```
Event Sources (Order Service, Auth Service, Marketing Platform, ...)
  |
  v
[Notification Trigger API]
  |
  +--[User Preferences Service (cache)]
  |       Answers: is push enabled? email opted out? SMS verified?
  |
  v
[Notification Router]
  |
  +--[High Priority Queue (Kafka: topic=notifications-critical)]
  |     OTPs, payment alerts, security events
  |
  +--[Standard Queue (Kafka: topic=notifications-standard)]
  |     Order updates, social alerts
  |
  +--[Low Priority Queue (Kafka: topic=notifications-marketing)]
        Promotions, weekly digests

     |            |            |
     v            v            v
[Push Workers] [Email Workers] [SMS Workers]
     |            |            |
     v            v            v
[FCM / APNs]  [SendGrid/SES]  [Twilio]
     |            |            |
     v            v            v
  [Notification Log (Cassandra)]
  (record every sent notification for deduplication + analytics)
```

APIs:

```
POST /notifications/send
  body: {
    event_type: string,          // "order_confirmed", "otp_login", "promo_weekly"
    user_ids: int[],             // target users
    template_id: string,         // which message template
    template_data: object,       // variables to fill in
    idempotency_key: string,     // for deduplication
    priority: "critical" | "standard" | "marketing"
  }
  returns: { notification_batch_id, queued_count }

GET /notifications/{user_id}?limit=20&before={cursor}
  returns: notification history for in-app inbox
```

## Deep dive: priority queues

Not all notifications are equal. An OTP that takes 30 seconds to arrive is a failed login. A marketing email that arrives an hour late is fine.

Use separate Kafka topics per priority tier, with different consumer scaling:

```
Topic: notifications-critical
  Consumer group: critical-workers
  Instances: always-on, 50 workers
  SLA: delivered in < 5 seconds
  Contents: OTP, security alerts, payment failures

Topic: notifications-standard
  Consumer group: standard-workers
  Instances: auto-scaled 10-100 workers
  SLA: delivered in < 60 seconds
  Contents: order confirmations, friend requests, delivery updates

Topic: notifications-marketing
  Consumer group: marketing-workers
  Instances: auto-scaled 2-20 workers (scaled down during peak to not compete)
  SLA: delivered within 4 hours
  Contents: promotions, digests, re-engagement
```

Critical workers are never starved by marketing volume because they read from a separate topic with dedicated consumers. Marketing workers auto-scale down during peak traffic to preserve capacity for critical and standard notifications.

## Deep dive: user preferences and channel selection

Before sending any notification, check:
1. Does the user have this channel enabled?
2. Has the user opted out of this event type?
3. Is this channel verified? (Phone number verified for SMS, device token registered for push)

```python
def get_channels_for_user(user_id: int, event_type: str) -> list[str]:
    # Cache in Redis with 5-minute TTL (preferences change rarely)
    cache_key = f"prefs:{user_id}:{event_type}"
    cached = r.get(cache_key)
    if cached:
        return json.loads(cached)

    prefs = db.query("""
        SELECT channel, opted_in FROM user_notification_prefs
        WHERE user_id = %s AND (event_type = %s OR event_type = 'all')
    """, user_id, event_type)

    channels = [p['channel'] for p in prefs if p['opted_in']]
    r.setex(cache_key, 300, json.dumps(channels))
    return channels

def select_channel(channels: list[str], event_type: str, priority: str) -> list[str]:
    # For critical events: use all available channels (belt and suspenders)
    if priority == "critical":
        return channels

    # For standard events: prefer push; fall back to email if no push token
    if "push" in channels:
        return ["push"]
    if "email" in channels:
        return ["email"]
    return []
```

## Deep dive: deduplication

The notification pipeline has retries at every layer. An event can be published to Kafka multiple times (producer retry), a consumer can process the same message twice (partition rebalance before commit), and the delivery provider can accept the same request twice (network retry).

**Idempotency key approach**:

```python
def send_notification(idempotency_key: str, user_id: int, channel: str, content: dict) -> bool:
    # Check if already sent
    dedup_key = f"notif:sent:{idempotency_key}:{user_id}:{channel}"
    already_sent = r.set(dedup_key, 1, nx=True, ex=86400)  # NX = only set if not exists
    if not already_sent:
        return False  # duplicate, skip

    # Send to provider
    success = delivery_provider[channel].send(user_id, content)

    # Log result
    notification_log.insert({
        "idempotency_key": idempotency_key,
        "user_id": user_id,
        "channel": channel,
        "status": "sent" if success else "failed",
        "sent_at": now(),
    })
    return success
```

The Redis `SET NX` (set if not exists) is atomic -- only one process can acquire the dedup key. TTL of 24 hours means the key expires and the dedup window is bounded.

**Cost of a duplicate by event type:**

| Event type | Duplicate cost | Strategy |
| --- | --- | --- |
| OTP | Security risk (replay attack) | 1-hour dedup window; expire OTP after first use |
| Payment confirmation | User confusion | 24-hour dedup window |
| Marketing | Minor annoyance | 7-day dedup window to avoid re-sending campaigns |

## Deep dive: per-user rate limiting

Even with deduplication, a bug in the event source can flood a user with notifications. A user receiving 50 "order confirmed" notifications in 5 minutes is a product failure.

Apply a per-user rate limit at the notification router level:

```python
def is_user_rate_limited(user_id: int, channel: str, event_type: str) -> bool:
    # Allow at most 10 notifications per user per channel per hour
    key = f"rate:{user_id}:{channel}:{int(time.time()) // 3600}"
    count = r.incr(key)
    r.expire(key, 7200)  # 2 hours TTL (covers current + previous hour)
    return count > 10

# Exception: critical events bypass rate limiting
def should_send(user_id, channel, event_type, priority) -> bool:
    if priority == "critical":
        return True
    return not is_user_rate_limited(user_id, channel, event_type)
```

This catches runaway event sources before they bombard users. The rate limit is per-channel so a user can still receive 10 push notifications and 10 emails per hour -- not 10 total.

## Deep dive: device token management

Push notifications require a valid device token (FCM registration token for Android, APNs device token for iOS). Tokens are device-specific and can become invalid when:
- The user uninstalls the app
- The user clears app data
- The token is rotated by the OS

When FCM/APNs returns an error indicating an invalid token, remove it immediately:

```python
def handle_push_response(user_id: int, token: str, response):
    if response.is_invalid_token_error():
        db.delete_device_token(user_id, token)
        # fall back to email/SMS if available
```

Stale tokens accumulate silently otherwise. A notification system that never cleans stale tokens wastes FCM quota and inflates your "sent" count without actual delivery.

## Failure modes

**FCM / APNs unreachable**: push delivery fails. Retry with exponential backoff (1s, 2s, 4s, max 3 retries). After max retries, log as failed and optionally fall back to email for critical events.

**Email ESP rate limit**: if a single SendGrid API key is rate-limited, requests fail. Mitigate with multiple API keys and key rotation. Monitor delivery rate per key and rotate to a fresh key when rate-limited.

**Kafka consumer lag**: if marketing workers fall behind (e.g. a large marketing campaign queues 100M notifications), the marketing Kafka topic grows. Standard and critical workers are on separate topics and are unaffected. Alert when marketing consumer lag exceeds 4 hours (the SLA).

**Notification log unavailable**: cannot write to the notification history store. Deduplication still works via Redis. Skip the log write and retry later (or use Kafka as a WAL for the log). Users may not see their notification history in-app until the log recovers.

## Key takeaways

**Separate queues per priority level are the most important design decision.** A single notification queue where marketing campaigns share capacity with OTPs is a reliability time bomb. Separate Kafka topics with dedicated consumer groups per priority tier is the production-grade answer.

**Deduplication is non-negotiable for critical events.** A user receiving a duplicate OTP can attempt a replay attack. A user receiving a duplicate payment confirmation calls your support line. The Redis NX + idempotency key pattern is simple, atomic, and effective.

**User preferences on the hot path must be cached.** Checking three preference rows from a relational DB on every notification send at 8,100 QPS will saturate the DB. Cache preferences in Redis with a 5-minute TTL. Preference staleness of 5 minutes is acceptable -- a user who opts out does not need instant effect.

**Treat push as best-effort and pull as authoritative.** Push notifications are not guaranteed. Critical notifications (security alerts, failed payments) should also be accessible via pull (in-app notification inbox) so users who did not receive the push can still find the information.

**Per-user rate limiting catches bugs before users feel them.** A runaway event source sending 1,000 notifications to a user in an hour is a bug. Rate limiting at the notification router catches it before delivery and gives you time to fix the source without user impact.

## References

- [Apple Push Notification service (APNs) documentation](https://developer.apple.com/documentation/usernotifications)
- [Firebase Cloud Messaging documentation](https://firebase.google.com/docs/cloud-messaging)
- [SendGrid rate limits and best practices](https://docs.sendgrid.com/for-developers/sending-email/rate-limits)
- [Uber notification system architecture](https://www.uber.com/blog/unified-notifications-platform/)

## Related topics

- [Interview Framework](../../interview-framework/), the 4-step approach used in this walkthrough
- [Message Queues](../../message-queues/), Kafka as the backbone of the notification pipeline
- [Rate Limiting](../../rate-limiting/), per-user rate limiting patterns
- [Caching](../../caching/), Redis for preference caching and deduplication
- [Chat System](../chat-system/), the push notification path used for offline message delivery
