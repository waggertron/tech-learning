---
title: "Case Study: Video Streaming"
description: "Full system design walkthrough for YouTube-style video streaming: chunked upload, transcoding DAGs, adaptive bitrate delivery, CDN strategy, and why the upload pipeline is separate from the playback pipeline."
parent: case-studies
tags: [system-design, case-studies, interviews, video, streaming]
status: draft
created: 2026-05-06
updated: 2026-05-06
---

Video streaming is one of the most technically rich [system design](../) problems. It splits cleanly into two independent pipelines: the upload and processing pipeline (write path) and the playback pipeline (read path). Great answers treat these as completely separate systems that share only the storage layer. The most common mistake is conflating them and designing a single system that tries to do both.

## Clarifying questions

- **Content type**: user-generated (like YouTube) or licensed/premium (like Netflix)?
- **Features in scope**: upload, transcoding, playback, recommendations, comments, monetization?
- **Live streaming**: VOD (video on demand) only, or also live streaming? (Completely different architecture.)
- **Scale**: uploads per day, concurrent viewers, average video length?
- **Supported resolutions**: 360p through 4K? Mobile-optimized formats?
- **Geographic scope**: single region or global CDN?

What the answers reveal:
- Licensed content (Netflix) has strict DRM requirements that change the encryption architecture
- Live streaming requires a low-latency ingest path (RTMP/SRT) and HLS segment generation in real time -- fundamentally different from VOD
- Geographic scope determines whether multi-CDN is required

For this walkthrough: YouTube-style user-generated VOD. 500 hours uploaded/minute, 1B hours watched/day. Global audience.

## Estimation

```
Upload bandwidth:
  500 hours/min uploaded
  1 hour of raw 1080p video: ~2 GB
  500 * 2 GB/min = 1,000 GB/min = 16.7 GB/sec ingest
  That is ~133 Gbps -- needs a large dedicated ingest fleet

Transcoding output per uploaded hour:
  Source (1080p): 2 GB
  Transcoded: 720p (1 GB) + 480p (0.5 GB) + 360p (0.25 GB) + audio (0.1 GB) = ~3.85 GB
  Total per uploaded hour: ~6 GB
  Daily: 500 * 60 * 6 GB = 180,000 GB/day = 180 TB/day
  Annual: 180 TB * 365 = 65.7 PB/year

Playback bandwidth:
  1B hours watched/day = 11,574 hours/sec
  Average stream: 4 Mbps
  11,574 hours/sec * 3600 sec/hr * 4 Mbps = ~166 Tbps delivery
  This is CDN-scale; must use multi-CDN

CDN cache hit rate:
  Pareto principle: top 20% of videos get 80% of views
  A well-warmed CDN hits 95%+ for popular content
  Only 5% of views reach your origin -- CDN absorbs 157 Tbps
```

**Conclusion**: playback is a CDN problem. Upload is a bandwidth and transcoding throughput problem. Design them separately.

## High-level design

```
UPLOAD PATH:
  Creator --> [Upload Service] --> [Pre-signed URL] --> [S3 Raw]
                                                            |
                                                  [Event: upload complete]
                                                            |
                                                   [Transcoding Queue (Kafka)]
                                                            |
                                                   [Transcoding Workers (GPU fleet)]
                                                            |
                                     [S3 Processed: 360p / 480p / 720p / 1080p / audio]
                                                            |
                                                  [Update Video DB: status=ready]
                                                            |
                                                 [CDN Pre-warm (top predicted videos)]

PLAYBACK PATH:
  Viewer --> [API: GET /video/{id}/manifest] --> [Manifest Service]
                                                       |
                                              [Video DB: metadata + segment locations]
                                                       |
                                              [Generate HLS manifest (m3u8)]
                                                       |
                                              [Viewer fetches segments from CDN]
                                                       |
                                             [CDN miss -> S3 Processed]
```

APIs:

```
POST /upload/init
  body:    { filename, size_bytes, duration_seconds, content_type }
  returns: { upload_id, upload_url (pre-signed S3), chunk_size }

PUT /upload/{upload_id}/chunk/{chunk_index}
  body:    raw bytes (uploaded directly to S3 via pre-signed URL)
  returns: { chunk_received: true }

POST /upload/{upload_id}/complete
  body:    { total_chunks }
  returns: { video_id, status: "processing" }

GET /video/{video_id}/manifest
  returns: HLS master manifest (m3u8) with bitrate variants

GET /video/{video_id}/status
  returns: { status: "processing" | "ready" | "failed", progress_percent }
```

## Deep dive: chunked upload

Large video files (a 2-hour 4K video is 40+ GB) cannot be uploaded in a single HTTP request. Network interruptions would require restarting the entire upload.

Chunked (resumable) upload breaks the file into 5-10 MB chunks, uploads each independently, and allows resuming from the last successful chunk.

```python
import hashlib

CHUNK_SIZE = 5 * 1024 * 1024  # 5 MB

def upload_video(filepath: str, upload_service_url: str):
    filesize = os.path.getsize(filepath)

    # Step 1: initialize upload session
    session = requests.post(f"{upload_service_url}/upload/init", json={
        "filename": os.path.basename(filepath),
        "size_bytes": filesize,
        "chunk_size": CHUNK_SIZE,
    }).json()
    upload_id = session["upload_id"]

    # Step 2: upload chunks
    with open(filepath, "rb") as f:
        chunk_index = 0
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            checksum = hashlib.md5(chunk).hexdigest()
            # Upload directly to S3 pre-signed URL (not through app server)
            requests.put(session["chunk_urls"][chunk_index], data=chunk,
                        headers={"Content-MD5": checksum})
            chunk_index += 1

    # Step 3: finalize
    requests.post(f"{upload_service_url}/upload/{upload_id}/complete",
                 json={"total_chunks": chunk_index})
```

The pre-signed URLs mean each chunk goes directly to S3 -- app servers never touch the video bytes. App servers only manage session state.

## Deep dive: transcoding pipeline

Transcoding is CPU/GPU intensive. A 1-hour video takes 30-60 minutes to transcode on a single CPU core. At 500 hours uploaded per minute, a naive single-server transcoding system would need 500+ minutes of transcoding per minute of uploads -- clearly impossible.

**DAG-based parallel pipeline**:

```
Upload complete (trigger)
  |
  v
[Split into segments (2-second chunks)] --> S3 raw segments
  |
  +--[Transcode 1080p  (GPU worker)]--+
  +--[Transcode 720p   (GPU worker)]--+----> S3 processed segments
  +--[Transcode 480p   (GPU worker)]--+
  +--[Transcode 360p   (GPU worker)]--+
  |
  +--[Extract audio track]----> S3 audio
  |
  +--[Generate thumbnail at 3 points]--> S3 thumbnails
  |
  v
[Assemble HLS manifest]
  |
  v
[Update video status: ready]
  |
  v
[CDN pre-warm: push to edge nodes]
```

Key architecture decisions:

**Spot/preemptible instances for transcoding workers**: transcoding is embarrassingly parallelizable and checkpoint-able. Spot instances cost 70% less than on-demand. If a spot instance is reclaimed mid-transcode, the job is re-queued from the last completed segment.

**Per-segment transcoding**: instead of transcoding the whole file, split into 2-second segments first, transcode segments in parallel across many workers, reassemble. This gives near-linear speedup with worker count.

**GPU-accelerated encoding**: NVENC (NVIDIA) and VCN (AMD) accelerate H.264/H.265 encoding 5-10x versus CPU. Required at YouTube scale.

**Kafka for job coordination**: each transcoding job is a Kafka message. Workers consume from the topic; failure means the message is re-consumed after the lease expires. DLQ (dead letter queue) captures repeatedly failing jobs.

## Deep dive: adaptive bitrate streaming (HLS)

HLS (HTTP Live Streaming) splits a video into 2-6 second segments and produces a playlist (m3u8 file) listing them. The player downloads segments one at a time, selecting the bitrate based on available bandwidth.

**Master manifest** (one per video):
```
#EXTM3U
#EXT-X-VERSION:3

#EXT-X-STREAM-INF:BANDWIDTH=800000,RESOLUTION=640x360
360p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=1500000,RESOLUTION=1280x720
720p/playlist.m3u8

#EXT-X-STREAM-INF:BANDWIDTH=4000000,RESOLUTION=1920x1080
1080p/playlist.m3u8
```

**Rendition manifest** (one per resolution):
```
#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:6

#EXTINF:6.0,
seg_000.ts
#EXTINF:6.0,
seg_001.ts
...
```

The player measures download speed for each segment and adjusts the rendition selection for the next segment. If segment download slows (congested network), the player switches down to 360p to avoid rebuffering.

**Why segments are served from CDN**: each 2-6 second segment is a static file. Static files are the ideal CDN content -- they are immutable, highly cacheable, and served from edge nodes near the viewer. The CDN hit rate for popular videos is >99%.

## Deep dive: CDN strategy

Serving 166 Tbps requires a CDN or a CDN-scale infrastructure.

**Multi-CDN**: use multiple CDN providers (Cloudflare, Fastly, Akamai, CloudFront). Route traffic based on geographic performance and CDN health. If one CDN has an outage, traffic fails over automatically. The CDN selection layer runs as a DNS-based routing layer (returns different CDN hostnames per region) or a client-side selection (try primary CDN; if slow, switch to secondary).

**CDN pre-warming**: when a video is likely to get high traffic (a new release, a scheduled event), push the segments to CDN edge nodes before the traffic arrives. This prevents the first wave of viewers from causing cache misses that flood the origin.

**Cache control headers**:
```
Cache-Control: public, max-age=31536000  # segments: immutable, cache forever
Cache-Control: public, max-age=60        # manifests: refresh often (for live or updated videos)
```

Segments are truly immutable once created. Cache them for a year. Manifests can change (for live streams or quality updates), so short TTLs.

## Failure modes

**Transcoding job failure**: the worker crashes mid-job. Kafka re-delivers the job after the lease expires. The job restarts from the last completed segment (checkpoint stored in S3 + DB). After 3 retries, move to DLQ and alert the team. Video stays in "processing" status.

**Upload interruption**: the user closes their browser mid-upload. The incomplete multipart upload lives in S3 as uncommitted parts (charged at full S3 price). Set an S3 lifecycle rule: abort incomplete multipart uploads after 7 days to avoid cost accumulation.

**CDN origin overload**: a viral video's origin segments are fetched by every CDN edge node simultaneously (cache miss wave). Mitigate with CDN origin shielding: a single regional CDN node acts as origin for all edge nodes in a region, collapsing N origin requests into 1.

**Video unavailability during processing**: a creator uploads a 2-hour video. Transcoding takes 20 minutes. During this time, the video shows "processing" and is not playable. Show a progress bar driven by the `GET /video/{id}/status` endpoint. Do not show the video in public feeds until status = "ready."

## Key takeaways

**Separate the upload path from the playback path.** These are independent systems that share only S3 as storage. The upload path is write-optimized (chunked upload, transcoding workers). The playback path is read-optimized (CDN, HLS segments). Designing them as one system is the most common architectural mistake.

**Pre-signed S3 URLs keep app servers out of the data path.** Without pre-signed URLs, every uploaded byte flows through your app servers -- which cannot handle 133 Gbps of upload traffic. Pre-signed URLs solve this instantly and elegantly.

**Transcoding is the hidden scaling challenge.** It is CPU/GPU intensive, takes minutes to hours per video, and must scale to thousands of concurrent jobs. GPU spot instances + Kafka + per-segment parallelism is the production-grade answer.

**Adaptive bitrate streaming is why video "just works" on bad networks.** HLS with multiple renditions means the player can degrade gracefully to 360p on a slow connection rather than buffering. This is a user experience decision with a deep infrastructure dependency.

**CDN cache hit rate is the key metric for playback.** If your hit rate drops from 99% to 90%, your origin traffic 10x's. Monitor cache hit rate per CDN, per region, per video. Pre-warming high-traffic videos before they go viral is an investment that pays off in origin cost savings.

## References

- [YouTube architecture at scale (Google I/O 2012)](https://www.youtube.com/watch?v=w5WVu624fY8)
- [HLS specification (Apple)](https://developer.apple.com/documentation/http-live-streaming)
- [Netflix tech blog: video streaming at scale](https://netflixtechblog.com/)
- [AWS Elemental MediaConvert (managed transcoding)](https://aws.amazon.com/mediaconvert/)

## Related topics

- [Interview Framework](../interview-framework/), the 4-step approach used in this walkthrough
- [Caching](../../caching/), CDN as a specialized cache layer
- [Message Queues](../../message-queues/), Kafka for transcoding job coordination
- [Scalability](../../scalability/), why the upload and playback paths scale independently
- [Social Feed](./social-feed/), when posts include video
