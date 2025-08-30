use tauri::{
    generate_handler,
    plugin::{Builder, TauriPlugin},
    Runtime,
};

pub mod commands;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("fs_extended")
        .invoke_handler(generate_handler![commands::copy_dir_recursive])
        .build()
}
