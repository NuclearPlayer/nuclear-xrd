---
description: How plugins define, read, and update persisted settings in Nuclear.
---

# Settings

## Settings API for Plugins

Persist user preferences, secrets, and configuration with a single API. This guide shows how to define settings, read/write values, and react to changes.

{% hint style="info" %}
Access settings via the API object (NuclearAPI.Settings.\*) or the React hook described below.
{% endhint %}

### Core concepts

* Namespace: the app automatically prefixes setting IDs.
  * Core settings: `core.<id>`
  * Plugin settings: `plugin.<pluginId>.<id>`
  * In your plugin, pass only the bare `id` (e.g. `theme`), skip the prefix.
* Types: boolean | number | string (enum is modeled as string with predefined options).
* Defaults: used until the user sets a value; only user-chosen values are persisted.
* Categories: free-form strings used to group settings in the UI.
* Hidden: settings with `hidden: true` are stored but not shown in standard UI.
* Persistence: values are saved to disk via Tauri's Store plugin.

### Quick start

{% tabs %}
{% tab title="Register settings" %}
```ts
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
    await api.Settings.register([
      {
        id: 'theme',
        title: 'Theme',
        description: 'Choose your preferred theme',
        category: 'Appearance',
        kind: 'enum',
        options: [
          { value: 'system', label: 'System' },
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ],
        default: 'system',
      },
      {
        id: 'scrobbleEnabled',
        title: 'Enable scrobbling',
        category: 'Integrations',
        kind: 'boolean',
        default: false,
        widget: { type: 'toggle' },
      },
    ]);
  },
};
```
{% endtab %}

{% tab title="Read and write" %}
```ts
// Read a value (string | number | boolean | undefined)
const theme = await api.Settings.get<string>('theme');

// Update a value
await api.Settings.set('theme', 'dark');

// Subscribe to changes
const unsubscribe = api.Settings.subscribe<string>('theme', (value) => {
  console.log('Theme changed to', value);
});

// Later
unsubscribe();
```
{% endtab %}
{% endtabs %}

### Setting definitions

```ts
type SettingCategory = string;

type BooleanSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'boolean';
  default?: boolean;
  hidden?: boolean;
  widget?: { type: 'toggle' };
};

type NumberSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'number';
  default?: number;
  hidden?: boolean;
  widget?:
    | { type: 'slider'; min?: number; max?: number; step?: number; unit?: string }
    | { type: 'number-input'; min?: number; max?: number; step?: number; unit?: string };
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
};

type StringSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'string';
  default?: string;
  hidden?: boolean;
  widget?:
    | { type: 'text'; placeholder?: string }
    | { type: 'password'; placeholder?: string }
    | { type: 'textarea'; placeholder?: string; rows?: number };
  format?: 'text' | 'url' | 'path' | 'token' | 'language';
  pattern?: string; // regex
  minLength?: number;
  maxLength?: number;
};

type EnumSettingDefinition = {
  id: string;
  title: string;
  description?: string;
  category: SettingCategory;
  kind: 'enum';
  options: { value: string; label: string }[];
  default?: string;
  hidden?: boolean;
  widget?: { type: 'select' } | { type: 'radio' };
};
```

#### ID rules

* Keep IDs short and stable: `theme`, `apiKey`, `language`, `refreshInterval`.
* Avoid dots in your IDs. Namespacing is automatic; you don’t need `plugin.my-id.theme`.

#### Categories

* Any string. Use i18n strings, or sentence case, e.g. `General`, `Appearance`, `Integrations`.

#### Defaults and persistence

* If the user hasn’t set a value, `get(id)` resolves to the definition’s `default` or `undefined`.
* When a user sets a value, it’s persisted to disk and takes precedence over `default` on the next run.

### React hook (advanced)

The SDK exposes a React hook for live values: `useSetting(host, id)`.

```ts
import { useSetting, type SettingsHost } from '@nuclearplayer/plugin-sdk';

function ThemeBadge({ host }: { host: SettingsHost }) {
  const [theme, setTheme] = useSetting<string>(host, 'theme');
  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      {theme ?? 'system'}
    </button>
  );
}
```

{% hint style="warning" %}
In typical plugins you won’t have direct access to the `SettingsHost`. Prefer the async API on `api.Settings`. The hook is primarily for the core UI and advanced integrations where the app provides a `host` prop.
{% endhint %}

### Error handling

* If you call `api.Settings.*` before the settings host is available, an error is thrown: “Settings host not available”. In normal plugin lifecycles, the host is ready in `onLoad` and `onEnable`.
* `get(id)` returns `undefined` if neither a user value nor a default exists.

### End-to-end example

```ts
import type { NuclearPluginAPI } from '@nuclearplayer/plugin-sdk';

export default {
  async onLoad(api: NuclearPluginAPI) {
    await api.Settings.register([
      { id: 'apiKey', title: 'API Key', category: 'Account', kind: 'string', widget: { type: 'password' }, format: 'token' },
      { id: 'language', title: 'Language', category: 'General', kind: 'enum', options: [
        { value: 'en', label: 'English' },
        { value: 'fr', label: 'Français' },
      ], default: 'en' },
      { id: 'debug', title: 'Enable debug logs', category: 'Advanced', kind: 'boolean', default: false, hidden: true },
    ]);

    const lang = await api.Settings.get<string>('language');
    if (lang === 'fr') {
      // initialize French resources...
    }

    api.Settings.subscribe<string>('language', (next) => {
      // switch translations live
    });
  },

  async onEnable(api: NuclearPluginAPI) {
    const scrobbling = await api.Settings.get<boolean>('scrobbleEnabled');
    if (scrobbling) {
      // start scrobbling service
    }
  },
};
```

### Reference

```ts
// Domain API (preferred)
api.Settings.register(defs: SettingDefinition[]): Promise<{ registered: string[] }>
api.Settings.get<T extends SettingValue>(id: string): Promise<T | undefined>
api.Settings.set<T extends SettingValue>(id: string, value: T): Promise<void>
api.Settings.subscribe<T extends SettingValue>(id: string, cb: (v: T | undefined) => void): () => void

// Types
type SettingValue = boolean | number | string | undefined;
type SettingDefinition = BooleanSettingDefinition | NumberSettingDefinition | StringSettingDefinition | EnumSettingDefinition;
```

### Best practices

* Keep IDs stable to preserve persisted values across releases.
* Use `hidden: true` for internal toggles and feature flags.
* For secrets, prefer `widget: { type: 'password' }` and `format: 'token'`.
* Use enums for constrained strings and supply friendly labels.
* Validate and sanitize inputs that leave your plugin (e.g., network calls).

### Troubleshooting

| Symptom                       | Cause                                                    | Fix                                                                                                |
| ----------------------------- | -------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| “Settings host not available” | Called before plugin `onLoad` or outside runtime         | Move to `onLoad/onEnable` or use provided API only                                                 |
| `get(id)` returns `undefined` | No default and not yet set                               | Provide a `default` or handle `undefined`                                                          |
| Value reverts after restart   | Not calling `set(id, value)` or overriding with defaults | Ensure you persist via `set` and avoid re-registering with a different default for already-set IDs |

***

If you spot issues or want new widgets/kinds, open a discussion or PR.
