---
title: "Case Study: Social Media Feed"
description: "Full system design walkthrough for a Twitter/Instagram-style social feed: push vs pull fanout, the celebrity problem, hybrid strategies, ML ranking, and why the read/write ratio is the key insight."
parent: case-studies
tags: [system-design, case-studies, interviews, feed, fanout]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

The social feed problem is deceptively hard. The core challenge is not storing posts -- it is delivering the right posts to the right people at low latency, despite a wildly skewed distribution of followers. The key insight that separates good from great answers: the fanout strategy must handle celebrities (accounts with millions of followers) differently from regular users, and this hybrid design falls out naturally once you understand the trade-offs.

## Clarifying questions

- **What to display**: posts from users I follow only, or also recommended content?
- **Post types**: text only, or also images and video?
- **Feed ordering**: chronological or algorithmic (engagement-based ranking)?
- **Scale**: how many DAU? Average follows per user? Average posts per day?
- **Interactions**: likes, comments, reposts -- do these appear in the feed?
- **Read/write latency targets**: what is acceptable p99 for feed load? For post creation?

What the answers reveal:
- Algorithmic ranking changes the entire feed serving architecture (you cannot pre-compute a ranked feed easily)
- Image/video adds a media storage and CDN dimension
- Interactions that appear in the feed multiply the write fan-out significantly

For this walkthrough: 300M DAU, 500M total users, average 200 follows, 0.1 posts/user/day, chronological feed, text + images.

## Estimation

```
Post writes:
  300M DAU * 0.1 = 30M posts/day
  30M / 86,400 = 347 write QPS
  Peak (3x): ~1,000 write QPS

Feed reads:
  300M DAU * 20 feed loads/day = 6B reads/day
  6B / 86,400 = 69,444 read QPS
  Peak (3x): ~208,000 read QPS

Read/write ratio: 208,000 / 1,000 = 208:1

Post storage (text):
  30M/day * 300 bytes = 9 GB/day = 3.3 TB/year

Image storage (assume 50% of posts, 3 MB compressed):
  15M/day * 3 MB = 45 TB/day = 16.4 PB/year
```

**Conclusion**: 208:1 read/write ratio means caching and pre-computation are the primary architectural levers. The system must serve 208K feed reads per second. The 1K post writes per second is not a scaling concern. Design for reads, not writes.

## High-level design

```
User posts
  |
  v
[Post Service] ---> [Posts DB] (write)
       |
       v
  [Fanout Queue (Kafka)]
       |
  [Fanout Workers]
       |
       v
  [Feed Cache (Redis)]     <--- feed read path starts here
  user:{id}:feed = sorted set of post_ids
       |
       v
  [Post Fetch Service] ---> [Posts DB] (read replicas)
  (hydrate post_ids with full post content)
       |
       v
  [CDN] (for images)
```

APIs:

```
POST /posts
  body:    { content: string, media_ids: string[] }
  returns: { post_id, created_at }

GET /feed?limit=20&cursor=<cursor>
  returns: { posts: [...], next_cursor }

POST /media/upload-url
  returns: { upload_url, media_id }  (pre-signed S3 URL for direct upload)
```

## Deep dive: fanout strategies

When a user posts, that post must appear in the feed of everyone who follows them. This is the **fanout problem** -- one write fans out to N reads.

### Option A: Fan-out on write (push model)

When a post is created, immediately write it into every follower's feed cache.

```python
def on_post_created(post_id, author_id):
    followers = db.get_followers(author_id)  # could be millions
    for follower_id in followers:
        r.zadd(f"feed:{follower_id}", {post_id: timestamp})
        r.zremrangebyrank(f"feed:{follower_id}", 0, -1001)  # keep top 1000
```

**Pros**: feed reads are O(1) from Redis. Any user's feed load is instant.

**Cons**: if a user has 10M followers, one post triggers 10M Redis writes. This is a write amplification bomb. Lady Gaga posting takes minutes to propagate, not milliseconds.

### Option B: Fan-out on read (pull model)

When a user loads their feed, query the posts table for posts from all followees, merge, and sort.

```python
def get_feed(user_id, limit=20, cursor=None):
    followees = db.get_followees(user_id)  # user follows these people
    # Query posts from all followees since cursor
    posts = db.query(
        "SELECT * FROM posts WHERE user_id IN %s AND created_at < %s ORDER BY created_at DESC LIMIT %s",
        followees, cursor, limit
    )
    return merge_sorted(posts)
```

**Pros**: no write amplification. Celebrities' posts are handled the same as anyone else's.

**Cons**: a user who follows 2,000 people triggers 2,000 DB queries (or a heavy IN clause) on every feed load. At 208,000 feed reads/second, this crushes the database.

### Option C: Hybrid (the right answer)

Use fan-out on write for regular users, fan-out on read for celebrities.

Define a celebrity threshold: accounts with > 1M followers skip the write fanout.

```python
CELEBRITY_THRESHOLD = 1_000_000

def on_post_created(post_id, author_id):
    follower_count = db.get_follower_count(author_id)
    if follower_count < CELEBRITY_THRESHOLD:
        # fan out to all followers (safe: <1M writes)
        fanout_to_followers(post_id, author_id)
    # celebrities: do NOT fan out; pull at read time

def get_feed(user_id, limit=20, cursor=None):
    # 1. Get pre-computed feed from Redis (from fanout of regular users)
    feed_post_ids = r.zrevrangebyscore(f"feed:{user_id}", "+inf", cursor, start=0, num=limit*2)

    # 2. Get celebrities this user follows
    celebrities = db.get_celebrity_followees(user_id)
    celebrity_posts = db.get_recent_posts(celebrities, since=cursor, limit=limit)

    # 3. Merge and return top N by timestamp
    return merge_and_trim([feed_post_ids, celebrity_posts], limit)
```

At read time, the merge of pre-computed + celebrity posts involves at most a few hundred celebrity posts -- fast even as a DB query.

## Deep dive: feed storage in Redis

Each user's feed is stored as a Redis sorted set:

```
Key:   feed:{user_id}
Score: post timestamp (Unix ms, used for chronological ordering)
Value: post_id (integer)
```

Operations:
- Add post: `ZADD feed:{user_id} {timestamp} {post_id}`
- Read feed: `ZREVRANGEBYSCORE feed:{user_id} +inf {cursor} LIMIT 0 20`
- Trim (keep only 1000 most recent): `ZREMRANGEBYRANK feed:{user_id} 0 -1001`

**Memory estimate**: 1000 post IDs per user, each 8 bytes + Redis overhead ~50 bytes = 58 bytes/entry * 1000 = 58 KB per user. For 500M users: 500M * 58 KB = 29 TB. This does not fit in a single Redis node -- shard by user_id across a Redis cluster.

Only store active users in Redis. Users who have not logged in for 30 days can have their feed evicted and rebuilt on next login (cold start: fall back to pull model for the first load).

## Deep dive: media (images and video)

Post images are not stored inline in the post DB. They live in object storage (S3), served via CDN.

Upload flow (direct-to-S3, bypassing app servers):

```
1. Client: POST /media/upload-url
   Server: generate pre-signed S3 URL, return to client

2. Client: PUT {pre-signed-url} with image bytes (directly to S3)

3. Client: POST /posts with { content, media_ids: [s3_key] }

4. Server: create post record with media references
```

This keeps app servers out of the upload data path. S3 handles the bandwidth. App servers only handle metadata.

After upload, a media processing pipeline (Lambda/event trigger) generates thumbnails (150px, 640px, 1200px), runs content moderation, and updates the media record status to `ready`. The post is not visible in feeds until media processing completes.

## Deep dive: algorithmic ranking

If the feed is ranked (most engagement predicted to be relevant), the design changes significantly:

1. The fanout still produces candidate post_ids per user
2. At read time, a ranking service scores each candidate using:
   - User features (engagement history by post type, author affinity)
   - Post features (early engagement rate, freshness, author reach)
   - Context features (time of day, device type)
3. A lightweight ML model (gradient boosted trees or a small neural net) produces a relevance score
4. Return top 20 by score

The ranking model is trained offline on engagement labels (clicks, watch time, likes). It is deployed as a low-latency inference service (50-100ms budget for 100-200 candidates).

This is what Instagram, TikTok, and Twitter's "For You" feed do. The feed becomes a two-stage pipeline: candidate retrieval (fanout) then ranking (ML scoring).

## Failure modes

**Fanout worker falls behind**: a viral post triggers a flood of writes. Kafka buffers the fanout jobs and workers process them sequentially. Users see a delay of seconds to minutes before the post appears in all feeds. This is acceptable for most social feeds.

**Redis node failure**: [consistent hashing](../consistent-hashing/) redistributes keys to adjacent nodes. Affected users see a cold feed (falls back to pull model) until their feed is rebuilt. Redis Cluster handles this automatically.

**Post DB overload during cold start**: a user who has not logged in for 60 days logs back in. Their Redis feed is empty, so the pull-model cold start queries all their followees' recent posts. If 10,000 users simultaneously do this, the DB is flooded. Mitigate with a queue-based cold-start rebuild (fanout worker priority queue for active but cache-evicted users).

**Image CDN failure**: posts still show but images fail. App must handle gracefully (placeholder images, retry logic). Multi-CDN routing (Cloudflare + CloudFront) provides failover.

## Key takeaways

**The 208:1 read/write ratio is the key insight.** State it early. It immediately tells you that caching and pre-computation are the levers, not write optimization. Interviewers notice when you derive the architectural direction from the numbers.

**The celebrity problem is the interview's trap.** Pure fan-out on write looks correct until someone mentions Justin Bieber or Taylor Swift. The hybrid strategy is the "right" answer -- push for regular users, pull for celebrities at read time. Bringing this up proactively signals senior thinking.

**Never store post content in the feed cache.** The feed cache holds post_ids and timestamps, not full post data. Hydrating post_ids into full posts at read time is a separate concern. This separation means the feed cache stays compact and the post content is never duplicated across millions of user feeds.

**Pre-signed S3 upload URLs are almost always the right answer for media.** They bypass your app servers entirely, remove app servers from the data path, and scale automatically with S3.

**Algorithmic ranking is a separate system.** If asked to include ML ranking, treat it as a layer on top of the fanout -- the fanout produces candidates, ranking selects the best N. Do not redesign the entire fan-out system around ranking.

## References

- [How Twitter's timeline works (2013)](https://blog.twitter.com/engineering/en_us/a/2013/new-tweets-per-second-record-and-how)
- [Instagram feed architecture at scale](https://instagram-engineering.com/feed-architecture-at-scale-11c1ded14c25)
- [Designing Data-Intensive Applications, Kleppmann, Chapter 11 (stream processing)](https://dataintensive.net/)

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach used in this walkthrough
- [Caching](../../caching/), Redis sorted sets for feed storage
- [Message Queues](../../message-queues/), Kafka fanout pipeline
- [Databases at Scale](../../databases/), read replicas for post hydration
- [Video Streaming](./video-streaming/), when posts include video
