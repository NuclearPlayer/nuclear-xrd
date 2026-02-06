# Logging

Nuclear uses [Tauri's log plugin](https://v2.tauri.app/plugin/logging/) for unified Rust + TypeScript logging. All logs go to stdout, log files on disk, and the in-app log viewer (via webview forwarding).

Each platform has its own [log directory](https://v2.tauri.app/reference/javascript/api/namespacepath/#applogdir).

## Log Levels

| Level | When to use | Examples |
|-------|-------------|----------|
| error | Something failed that the user cares about | Stream resolution failed, plugin crash, file write failed |
| warn | Something unexpected but recoverable. Or something you should fix, because it will start failing in the future | Retrying requests, fallback used, deprecated API called |
| info | User-initiated actions | Plugin enabled, theme changed, track started playing |
| debug | Anything that's useful for debugging | HTTP request/response details, state transitions, timing |
| trace | Extremely verbose, rarely needed | Function entry/exit |

**Production default:** `info` and above

**Dev builds:** `debug`

You can enable `trace` for yourself locally, but it's not used anywhere by default.

## Using Logger in Core Code

The `Logger` service provides scoped loggers. Import from `@/services/logger`.

Available scopes: `app`, `playback`, `streaming`, `plugins`, `http`, `fs`, `settings`, `themes`, `updates`, `queue`, `metadata`

```typescript
import { Logger } from '@/services/logger';

Logger.playback.info('Track started playing');
Logger.streaming.error('Failed to resolve stream');
Logger.plugins.debug('Loading plugin manifest');
```

All methods are async (return promises) but can be fire-and-forget (no need to await).

Each scope automatically prefixes messages with `[scope]`. For example, `Logger.plugins.info('Loaded')` produces `[plugins] Loaded` in the log output.

Use `formatLogValue()` to format JS objects, arrays, and Errors into log-safe strings. It's a DWIM (Do What I Mean) utility. Whatever you throw its way, it'll handle it.

## Reporting Errors to Users

The `reportError` utility logs the full error and shows a clean toast. Import from `@/utils/logging`.

```typescript
import { reportError } from '@/utils/logging';

reportError('plugins', {
  userMessage: 'Failed to load plugin',
  error,
});
```

- First argument is the log scope (same scopes as Logger)
- `userMessage` appears in the toast title
- `error` is a caught error (from catch block); the error message is truncated to 100 chars for the toast description
- Stack traces never appear in toasts

## Plugin Logging API

Plugins use `api.Logger` (provided by the plugin SDK). All methods are synchronous and fire-and-forget.

```typescript
const plugin: NuclearPlugin = {
  onLoad(api: NuclearPluginAPI) {
    api.Logger.info('Plugin loaded');
    api.Logger.debug('Initializing providers...');
  },
  onEnable(api: NuclearPluginAPI) {
    api.Logger.info('Plugin enabled');
  },
};
```

Available methods: `trace()`, `debug()`, `info()`, `warn()`, `error()`

Logs from plugins are automatically prefixed with `[plugin:plugin-id]`. Plugin authors don't need to add any prefix.

Plugin debug logs are always captured, even in production. This is intentional - plugin issues are the hardest to debug remotely.

Don't try being cute with the plugin ID. It's tamper-resistant, and I know where you live.

## Rust-Side Logging

For Rust code, use the standard `log` crate macros (`trace!`, `debug!`, `info!`, `warn!`, `error!`).

Use the `target` parameter to identify the source:

```rust
use log::{debug, error};

debug!(target: "http", "GET {} -> {}", url, status);
error!(target: "http", "Request failed: {}", err);
```

Rust HTTP logging already includes:

- Header redaction (authorization, cookie, x-api-key, etc.)
- Query parameter redaction (api_key, token, secret, etc.)
- Body logging shows only length, never content. This might change in the future if we find it's needed.

## Log File Locations

The bundle identifier is `com.nuclearplayer`.

| Platform | Location |
|----------|----------|
| macOS | `~/Library/Logs/com.nuclearplayer/` |
| Linux | `~/.local/share/com.nuclearplayer/logs/` |
| Windows | `%APPDATA%\com.nuclearplayer\logs\` |

Log files:

- Max 5MB per file
- Rotated automatically, keeping the 7 most recent files
- Named by Tauri's log plugin (timestamp-based)

Users can access log files via the "Open Log Folder" button in the Logs view, or navigate to the directory manually.

## In-App Log Viewer

Nuclear has a built-in log viewer accessible from the sidebar.