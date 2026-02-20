#!/usr/bin/env bash
set -euo pipefail

DEB_PATH="$1"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

mv "$DEB_PATH" "$SCRIPT_DIR/nuclear.deb"

cp "$REPO_ROOT/packages/player/src-tauri/resources/com.nuclearplayer.Nuclear.desktop" "$SCRIPT_DIR/"
cp "$REPO_ROOT/packages/player/src-tauri/resources/com.nuclearplayer.Nuclear.metainfo.xml" "$SCRIPT_DIR/"

ICONS_DIR="$REPO_ROOT/packages/player/src-tauri/icons"
cp "$ICONS_DIR/icon.png" "$SCRIPT_DIR/icon-512.png"

for size in 256 128 32; do
  if [ -f "$ICONS_DIR/${size}x${size}.png" ]; then
    cp "$ICONS_DIR/${size}x${size}.png" "$SCRIPT_DIR/icon-${size}.png"
  else
    cp "$ICONS_DIR/icon.png" "$SCRIPT_DIR/icon-${size}.png"
  fi
done

cp "$REPO_ROOT/LICENSE" "$SCRIPT_DIR/"
