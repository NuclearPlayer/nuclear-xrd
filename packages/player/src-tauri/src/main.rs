// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    #[cfg(target_os = "linux")]
    apply_linux_workarounds();

    app_lib::run();
}

#[cfg(target_os = "linux")]
fn apply_linux_workarounds() {
    // Fix for WebKitGTK DMA-BUF renderer causing "Could not create default EGL display:
    // EGL_BAD_PARAMETER" on various Linux systems including Steam Deck, NVIDIA GPUs,
    // and certain Wayland compositors.
    // See: https://github.com/tauri-apps/tauri/issues/9394
    if std::env::var("WEBKIT_DISABLE_DMABUF_RENDERER").is_err() {
        unsafe {
            std::env::set_var("WEBKIT_DISABLE_DMABUF_RENDERER", "1");
        }
    }
}
