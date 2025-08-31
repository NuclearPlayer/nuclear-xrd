# Nuclear Plugin SDK

Official toolkit for building Nuclear plugins.

## 1. What Is A Nuclear Plugin?
A small JavaScript/TypeScript bundle that exports lifecycle hooks and ships with a `package.json` describing metadata (display name, icon, permissions, etc.). The app reads the manifest for metadata, then loads and executes your exported hooks in-process.

## 2. Quick Start
```bash
mkdir my-plugin && cd my-plugin
pnpm init -y
pnpm add @nuclearplayer/plugin-sdk
# add dev tooling of your choice (vite, tsup, esbuild, rollup)
```

Create `src/index.ts`:
```ts
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
  },
  async onEnable(api: NuclearPluginAPI) {
  },
  async onDisable() {
  },
  async onUnload() {
  },
};
```

Bundle to `dist/index.js` (or set a custom `main`). Ensure the output is a CommonJS style bundle (assigns to `module.exports` or `exports.default`).

## 3. Manifest (package.json) Specification
Required top-level fields:
- `name`: Unique plugin id (used internally). Scoped names allowed.
- `version`: Semver string.
- `description`: One line summary shown to users.
- `author`: Plain string.

Optional standard fields:
- `main`: Entry file path relative to package root. If omitted the loader tries `index.js` then `dist/index.js`.

Optional Nuclear namespace (`nuclear`):
- `displayName`: Friendly name (falls back to `name`).
- `category`: Arbitrary grouping (examples: `source`, `integration`, `lyrics`, `utility`).
- `icon`: See Icon spec below.
- `permissions`: String array of declared capabilities (informational only right now).

Example:
```json
{
  "name": "@nuclear-plugin/lastfm",
  "version": "0.1.0",
  "description": "Scrobble tracks to Last.fm",
  "author": "Nuclear Team",
  "main": "dist/index.js",
  "nuclear": {
    "displayName": "Last.fm Scrobbler",
    "category": "integration",
    "icon": { "type": "link", "link": "https://example.com/icon.png" },
    "permissions": ["scrobble", "network"]
  }
}
```

## 4. Icon Specification
```ts
type PluginIcon = { type: 'link'; link: string };
```
Link icons should point to a local file path or remote URL; keep them small (<= 64x64, optimized).

## 5. Lifecycle Hooks
All hooks are optional. Export a default object containing any of:
- `onLoad(api)`: Runs after the plugin code is first evaluated and manifest metadata processed.
- `onEnable(api)`: Runs when user enables the plugin (may happen multiple times across sessions).
- `onDisable()`: Runs when disabled.
- `onUnload()`: Runs before the plugin is fully removed from memory.

Typical pattern:
```ts
export default {
  async onLoad(api) {
  },
  async onEnable(api) {
  },
  async onDisable() {
  },
  async onUnload() {
  },
};
```

## 6. Permissions
`permissions` is currently informational. Declare high-level capabilities your plugin intends to use (network, scrobble, playback-control, lyrics, search, storage, etc.). Future versions may expose UI around this.

## 7. File Structure Example
```text
my-plugin/
  package.json
  README.md
  src/
    index.ts
  dist/
    index.js        (built output)
  node_modules/
```

## 8. Building Your Plugin
You can use any bundler that outputs a single JS file that the loader can evaluate in a CommonJS style environment.

Example minimal `tsup` config (optional):
```jsonc
// package.json excerpt
"devDependencies": { "tsup": "^8" },
"scripts": { "build": "tsup src/index.ts --dts --format cjs --minify --out-dir dist" }
```
Run `pnpm build` to produce `dist/index.js`.

Ensure the final bundle sets `module.exports = { ... }` or `exports.default = { ... }`. Default ESM output alone will not be picked up unless your bundler transpiles it to a CommonJS wrapper.

## 9. Local Development Workflow
1. Create your plugin folder somewhere accessible.
2. Build to produce entry file.
3. (Future) Place or symlink the folder into the Nuclear plugins directory once auto-discovery is implemented. For now loading is manual (loader API expects a path).
4. Rebuild after changes; the app will need a reload or unload+load cycle when hot-reload support is added.

## 10. Best Practices
- Keep startup fast; defer heavy work until `onEnable`.
- Avoid global state leakage; store state on a module-local object.
- Validate network responses defensively.
- Use permissions array to communicate scope clearly.
- Keep dependencies minimal; smaller bundles load faster.

## 11. Troubleshooting
| Issue | Check |
|-------|-------|
| Loader cannot resolve entry | Is `main` correct or is there a built `index.js` / `dist/index.js`? |
| Missing fields error | Confirm all required manifest fields: name, version, description, author. |
| Hooks not firing | Ensure default export is an object, not a function or class. |

## 12. Type Exports
```ts
import type { NuclearPlugin, PluginManifest, PluginIcon } from '@nuclearplayer/plugin-sdk';
```

## 13. Example Complete Minimal Plugin (TypeScript)
```ts
import { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
  },
  async onEnable(api: NuclearPluginAPI) {
  },
  async onDisable() {
  },
  async onUnload() {
  },
};
```

## 14. License
AGPL-3.0-only