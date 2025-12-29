export type HttpRequestInit = {
  method?: string;
  headers?: Record<string, string>;
  body?: string;
};

export type HttpResponseData = {
  status: number;
  headers: Record<string, string>;
  body: string;
};

export type FetchFunction = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export type HttpHost = {
  fetch: (url: string, init?: HttpRequestInit) => Promise<HttpResponseData>;
};
