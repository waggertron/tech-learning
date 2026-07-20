---
title: Camera, PhotoKit, image pipelines, and Vision
description: "Capture or select images with limited-library support, orientation-safe processing, bounded memory, local analysis, cancellation, and consent."
date: 2026-07-19
tags: [ios, swift, camera, photokit, vision, images]
canonical: https://waggertron.github.io/tech-learning/posts/2026-07-19-camera-photokit-image-pipelines-vision/
series:
  slug: zero-to-ios-hero
  order: 101
---

Image work is a pipeline: acquire, authorize, decode, orient, transform, store, thumbnail, analyze, display, and delete. Each stage has different memory, privacy, and device evidence.

## Design the capability

- Prefer system pickers when they satisfy selection. Treat limited-library access as a first-class state.
- Capture through a device adapter and preserve orientation, color, metadata policy, and stable attachment identity.
- Generate bounded thumbnails instead of decoding every full-resolution image into scrolling views.
- Run Vision analysis off the UI path, expose confidence and correction, and keep local text recognition visible to the user.

## Validation boundary

No camera, real photo library, limited-library prompt, image orientation matrix, Vision request, or physical-device memory run occurred.

## Series navigation

- Previous: [Part 100: MapKit, Core Location, geocoding, and WeatherKit](../2026-07-19-mapkit-core-location-geocoding-weatherkit/)
- Next: [Part 102: Audio, speech, recording, and interruptions](../2026-07-19-audio-speech-recording-interruptions/)
- Series index: [Zero to iOS Hero](../series/zero-to-ios-hero/)

## References

- [PhotosUI](https://developer.apple.com/documentation/photosui)
- [PhotoKit](https://developer.apple.com/documentation/photokit)
- [Vision](https://developer.apple.com/documentation/vision)

## Related topics

- [System pickers](../2026-07-19-uikit-sheets-popovers-alerts-activities-system-pickers/)
- [Performance and device matrices](../2026-07-19-ios-performance-memory-energy-launch-device-matrices/)
