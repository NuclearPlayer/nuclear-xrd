---
description: Create and use custom JSON-based themes.
---

# Advanced themes

## Getting to your themes
Navigate to Nuclear → Preferences → Themes and look for the "Advanced themes" dropdown. Any JSON files you've added to your themes folder will show up here, ready to apply.

Your themes folder lives at:
- Linux: `~/.local/share/com.nuclearplayer/themes`
- macOS: `~/Library/Application Support/com.nuclearplayer/themes`
- Windows: `%APPDATA%/com.nuclearplayer/themes`

When you select a theme, it applies instantly. If you edit the file while it's active, you'll see your changes update live in the app.

## Creating your theme
Making a custom theme is straightforward:
1. Create a new `.json` file with any name you like. Copy one of the existing themes or the template at the end of this manual.
2. Save it to your themes folder (see paths above).
3. Select it from the Advanced themes dropdown in Nuclear.

Here's the basic structure to get you started:
```json
{
  "version": 1,
  "name": "My Theme",
  "vars": { /* your light mode colors and settings */ },
  "dark": { /* your dark mode colors and settings */ }
}
```

## What you can customize

**Colors**
- background, background-secondary, background-input
- foreground, foreground-secondary, foreground-input
- primary
- border, border-input, ring
- accent-green, accent-yellow, accent-purple, accent-blue, accent-orange, accent-cyan, accent-red

**Typography**
- font-family (example: "'Inter', system-ui, -apple-system, sans-serif")
- font-weight-normal, font-weight-bold

**Shape & visual effects**
- radius, radius-sm, radius-lg
- shadow-color, shadow-x, shadow-y, shadow-blur

## A few helpful notes
- `version` must always be `1`
- Put your light mode values in `vars` and dark mode values in `dark`
- Variable names don't need the `--` prefix—just use the name itself
- You can use hex colors (#ff0000), OKLCH (oklch(70% 0.15 30)), or any valid CSS color
- To reset everything back to default, just choose "Default" from the dropdown

## Template
Here's a complete template with Nuclear's default values that you can copy and customize:

```json
{
  "version": 1,
  "name": "My Custom Theme",
  "vars": {
    "background": "oklch(0.9491 0.023 341.75)",
    "background-secondary": "oklch(100% 0 0)",
    "background-input": "oklch(100% 0 0)",
    
    "foreground": "oklch(0% 0 0)",
    "foreground-secondary": "oklch(0.3 0 0)",
    "foreground-input": "oklch(0% 0 0)",
    
    "primary": "oklch(76.91% 0.173 341.75)",
    
    "border": "oklch(0% 0 0)",
    "border-input": "oklch(0% 0 0)",
    "ring": "oklch(100% 0 0)",
    
    "accent-green": "oklch(79.05% 0.209 147.58)",
    "accent-yellow": "oklch(95.53% 0.134 112.76)",
    "accent-purple": "oklch(74.2% 0.149 301.88)",
    "accent-blue": "oklch(55.98% 0.08 270.09)",
    "accent-orange": "oklch(83.39% 0.124 66.56)",
    "accent-cyan": "oklch(88.26% 0.093 212.85)",
    "accent-red": "oklch(68.22% 0.206 24.43)",
    
    "shadow-color": "oklch(0% 0 0)",
    "shadow-x": "2px",
    "shadow-y": "2px",
    "shadow-blur": "0px",
    
    "font-family": "'DM Sans', system-ui, -apple-system, sans-serif",
    "font-weight-normal": "400",
    "font-weight-bold": "700",
    
    "radius": "8px",
    "radius-sm": "4px",
    "radius-lg": "12px"
  },
  "dark": {
    "background": "oklch(0.4408 0.0838 341.75)",
    "background-secondary": "oklch(39.49% 0.031 277.49)",
    "background-input": "oklch(0% 0 0)",
    
    "foreground": "oklch(0.9249 0 0)",
    "foreground-secondary": "oklch(0.9249 0 0)",
    "foreground-input": "oklch(100% 0 0)"
  }
}
```
