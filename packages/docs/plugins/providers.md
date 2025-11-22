---
description: Extend Nuclear with custom metadata providers through the Providers API.
---

# Providers

## Providers API for Plugins

The Providers API allows plugins to register custom providers that supply metadata for tracks, albums, and artists. This enables Nuclear to integrate with any music service or database.

{% hint style="info" %}
Access providers via `NuclearAPI.Providers.*` in your plugin's lifecycle hooks. Only metadata providers are supported.
{% endhint %}

---

## Core concepts

### What are providers?

Providers are modules that fulfill specific data requests from Nuclear. When the app needs information (like album art, track metadata, or artist details), it queries the selected provider.

### Provider types

**Metadata Providers** (current)
- Supply information about tracks, albums, and artists
- Examples: MusicBrainz, Last.fm, Discogs
- Used for search, library management, and display