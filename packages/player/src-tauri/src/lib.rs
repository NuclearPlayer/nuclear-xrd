pub mod commands;
pub mod http;
pub mod logging;
mod setup;
pub mod stream_proxy;
pub mod ytdlp;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_upload::init())
        .register_asynchronous_uri_scheme_protocol("nuclear-stream", |ctx, request, responder| {
            stream_proxy::handle_stream_request(ctx.app_handle(), request, responder);
        })
        .invoke_handler(tauri::generate_handler![
            commands::copy_dir_recursive,
            commands::extract_zip,
            commands::download_file,
            http::http_fetch,
            ytdlp::ytdlp_search,
            ytdlp::ytdlp_get_stream,
            logging::get_startup_logs
        ])
        .setup(|app| setup::init(app).map_err(|e| e.into()))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
