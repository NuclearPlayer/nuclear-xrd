use base64::{engine::general_purpose::URL_SAFE_NO_PAD, Engine};
use http::{header, HeaderMap, HeaderName, Response, StatusCode};
use log::{debug, error, warn};
use once_cell::sync::Lazy;
use reqwest::Client;
use std::sync::Arc;
use tauri::{AppHandle, Runtime, UriSchemeResponder};
use tokio::runtime::Runtime as TokioRuntime;

// The purpose of this module is to bypass CORS restrictions in Tauri by streaming audio through a fake local URI scheme.
// Audio gets streamed from the original URL to this Rust module, which then passes it back to the Tauri frontend with replaced CORS headers.

const CORS_ALLOW_ORIGIN: &str = "Access-Control-Allow-Origin";
const CORS_ALLOW_METHODS: &str = "Access-Control-Allow-Methods";
const CORS_ALLOW_HEADERS: &str = "Access-Control-Allow-Headers";
const CORS_EXPOSE_HEADERS: &str = "Access-Control-Expose-Headers";

const FORWARD_HEADERS: &[HeaderName] = &[
    header::CONTENT_TYPE,
    header::CONTENT_LENGTH,
    header::CONTENT_RANGE,
    header::ACCEPT_RANGES,
];

// User agent matching yt-dlp's Android client.
// Required for YouTube URLs - they validate the UA matches what generated the signed URL.
const USER_AGENT: &str = "com.google.android.youtube/19.35.36 (Linux; U; Android 13; en_US; SM-S908E Build/TP1A.220624.014) gzip";

static HTTP_CLIENT: Lazy<Arc<Client>> = Lazy::new(|| {
    Arc::new(
        Client::builder()
            .user_agent(USER_AGENT)
            .build()
            .expect("Failed to create HTTP client"),
    )
});

static RUNTIME: Lazy<TokioRuntime> =
    Lazy::new(|| TokioRuntime::new().expect("Failed to create tokio runtime"));

fn respond_error(responder: UriSchemeResponder, status: StatusCode, message: String) {
    responder.respond(
        Response::builder()
            .status(status)
            .header(CORS_ALLOW_ORIGIN, "*")
            .body(message.into_bytes())
            .unwrap(),
    );
}

fn decode_stream_url(encoded: &str) -> Result<String, (StatusCode, String)> {
    let bytes = URL_SAFE_NO_PAD.decode(encoded).map_err(|e| {
        (
            StatusCode::BAD_REQUEST,
            format!("Invalid base64 URL: {}", e),
        )
    })?;

    let url = String::from_utf8(bytes).map_err(|e| {
        (
            StatusCode::BAD_REQUEST,
            format!("Invalid UTF-8 in URL: {}", e),
        )
    })?;

    if !url.starts_with("http://") && !url.starts_with("https://") {
        return Err((
            StatusCode::BAD_REQUEST,
            "Invalid URL scheme. Expected http(s)".to_string(),
        ));
    }

    Ok(url)
}

fn forward_headers(
    mut builder: http::response::Builder,
    source: &HeaderMap,
) -> http::response::Builder {
    for name in FORWARD_HEADERS {
        if let Some(value) = source.get(name) {
            builder = builder.header(name, value.to_str().unwrap_or(""));
        }
    }
    builder
}

pub fn handle_stream_request<R: Runtime>(
    _app: &AppHandle<R>,
    request: http::Request<Vec<u8>>,
    responder: UriSchemeResponder,
) {
    let uri = request.uri();
    let encoded_url = uri.path().trim_start_matches('/').to_string();

    debug!("[StreamProxy] Decoding URL (len: {})", encoded_url.len());

    let url = match decode_stream_url(&encoded_url) {
        Ok(url) => url,
        Err((status, message)) => {
            error!("[StreamProxy] {}", message);
            return respond_error(responder, status, message);
        }
    };

    let range_header = request
        .headers()
        .get(header::RANGE)
        .and_then(|v| v.to_str().ok())
        .map(|s| s.to_string());

    debug!("[StreamProxy] Fetching URL, range: {:?}", range_header);

    let client = HTTP_CLIENT.clone();

    RUNTIME.spawn(async move {
        let mut req_builder = client.get(&url);

        if let Some(ref range) = range_header {
            req_builder = req_builder.header(header::RANGE, range);
        }

        match req_builder.send().await {
            Ok(response) => {
                let status = response.status();
                let headers = response.headers().clone();

                if !status.is_success() && status != StatusCode::PARTIAL_CONTENT {
                    warn!("[StreamProxy] Upstream returned: {}", status);
                    return respond_error(
                        responder,
                        StatusCode::BAD_GATEWAY,
                        format!("Upstream returned error: {}", status),
                    );
                }

                match response.bytes().await {
                    Ok(body) => {
                        debug!("[StreamProxy] Got {} bytes", body.len());

                        let resp_builder = Response::builder()
                            .status(status.as_u16())
                            .header(CORS_ALLOW_ORIGIN, "*")
                            .header(CORS_ALLOW_METHODS, "GET, HEAD, OPTIONS")
                            .header(CORS_ALLOW_HEADERS, "Range, Content-Type")
                            .header(
                                CORS_EXPOSE_HEADERS,
                                "Content-Length, Content-Range, Accept-Ranges",
                            );

                        let resp_builder = forward_headers(resp_builder, &headers);

                        responder.respond(resp_builder.body(body.to_vec()).unwrap());
                    }
                    Err(e) => {
                        error!("[StreamProxy] Failed to read body: {}", e);
                        respond_error(
                            responder,
                            StatusCode::BAD_GATEWAY,
                            format!("Failed to read response: {}", e),
                        );
                    }
                }
            }
            Err(e) => {
                error!("[StreamProxy] Request failed: {}", e);
                respond_error(
                    responder,
                    StatusCode::BAD_GATEWAY,
                    format!("Failed to fetch: {}", e),
                );
            }
        }
    });
}
