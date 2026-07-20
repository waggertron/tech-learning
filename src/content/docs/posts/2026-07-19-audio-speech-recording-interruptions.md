---
title: Audio, speech, recording, and interruptions
description: "Record and transcribe voice notes through explicit audio-session, route, permission, interruption, file, consent, and recovery states."
date: 2026-07-19
tags: [ios, swift, audio, speech, recording, accessibility]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-audio-speech-recording-interruptions/
series:
  slug: zero-to-ios-hero
  order: 102
---

Audio behavior depends on user intent and the current route. Recording, playback, mixing, Bluetooth, phone calls, Siri, and background use cannot share one assumed session configuration.

## Design the capability

- Model idle, preparing, recording, paused, interrupted, finishing, transcribing, failed, and saved states.
- Configure an audio session for the active job and respond to route changes and interruptions without losing the file.
- Request microphone and speech access in context, explain processing, and preserve a useful nontranscribed recording path.
- Write incrementally to an app-owned file, enforce duration and storage limits, and clean partial captures deliberately.

## Validation boundary

No microphone permission, audio route, interruption, background mode, speech authorization, transcription service, or physical-device recording was exercised.

## Series navigation

- Previous: [Part 101: Camera, PhotoKit, image pipelines, and Vision](../2026-07-19-camera-photokit-image-pipelines-vision/)
- Next: [Part 103: Video capture, editing, playback, and streaming architecture](../2026-07-19-video-capture-editing-playback-streaming-architecture/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [AVFAudio](https://developer.apple.com/documentation/avfaudio)
- [Speech](https://developer.apple.com/documentation/speech)
- [Audio sessions](https://developer.apple.com/documentation/avfaudio/avaudiosession)

## Related topics

- [Security and permissions](../2026-07-19-ios-security-privacy-permissions-platform-policy/)
- [Media playback](../2026-07-19-avkit-avfoundation-playback-streaming-media-sessions/)
