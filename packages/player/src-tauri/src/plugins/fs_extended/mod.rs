use tauri::{
    generate_handler,
    plugin::{Builder, TauriPlugin},
    Runtime,
};

pub fn init<R: Runtime>() -> TauriPlugin<R> {
    Builder::new("fs_extended")
        .invoke_handler(generate_handler![])
        .build()
}
