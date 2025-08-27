#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn copy_dir_recursive(from: String, to: String) -> Result<(), String> {
    use std::fs;
    use std::path::{Path, PathBuf};

    fn inner(from: &Path, to: &Path) -> Result<(), std::io::Error> {
        fs::create_dir_all(to)?;
        for entry in fs::read_dir(from)? {
            let entry = entry?;
            let file_type = entry.file_type()?;
            let from_path = entry.path();
            let to_path: PathBuf = to.join(entry.file_name());
            if file_type.is_dir() {
                inner(&from_path, &to_path)?;
            } else if file_type.is_file() {
                if let Some(parent) = to_path.parent() {
                    fs::create_dir_all(parent)?;
                }
                fs::copy(&from_path, &to_path)?;
            } else if file_type.is_symlink() {
                let target = fs::read_link(&from_path)?;
                let target_abs = if target.is_absolute() {
                    target
                } else {
                    from_path.parent().unwrap_or(from).join(target)
                };
                if target_abs.is_dir() {
                    inner(&target_abs, &to_path)?;
                } else if target_abs.is_file() {
                    if let Some(parent) = to_path.parent() {
                        fs::create_dir_all(parent)?;
                    }
                    fs::copy(&target_abs, &to_path)?;
                }
            }
        }
        Ok(())
    }

    let from_p = Path::new(&from);
    let to_p = Path::new(&to);
    inner(from_p, to_p).map_err(|e| {
        log::error!("copy_dir_recursive failed: {}", e);
        e.to_string()
    })
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .invoke_handler(tauri::generate_handler![greet, copy_dir_recursive])
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
