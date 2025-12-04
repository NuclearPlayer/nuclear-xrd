import type { FetchFunction, HttpHost } from '../types/http';

const headersToRecord = (headers: HeadersInit): Record<string, string> => {
  if (headers instanceof Headers) {
    const result: Record<string, string> = {};
    headers.forEach((value, key) => {
      result[key] = value;
    });
    return result;
  }
  if (Array.isArray(headers)) {
    return Object.fromEntries(headers);
  }
  return headers;
};

function createFetchFromHost(host: HttpHost): FetchFunction {
  return async (
    input: RequestInfo | URL,
    init?: RequestInit,
  ): Promise<Response> => {
    const url = String(input instanceof Request ? input.url : input);
    const headers = init?.headers ? headersToRecord(init.headers) : undefined;
    const body = typeof init?.body === 'string' ? init.body : undefined;

    const response = await host.fetch(url, {
      method: init?.method,
      headers,
      body,
    });

    return new Response(response.body, {
      status: response.status,
      headers: new Headers(response.headers),
    });
  };
}

const noopHost: HttpHost = {
  fetch: async () => ({
    status: 501,
    headers: {},
    body: 'HTTP host not configured',
  }),
};

export class HttpAPI {
  readonly fetch: FetchFunction;

  constructor(host?: HttpHost) {
    this.fetch = createFetchFromHost(host ?? noopHost);
  }
}
