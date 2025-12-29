import { invoke } from '@tauri-apps/api/core';

import type {
  HttpHost,
  HttpRequestInit,
  HttpResponseData,
} from '@nuclearplayer/plugin-sdk';

export const httpHost: HttpHost = {
  fetch: async (
    url: string,
    init?: HttpRequestInit,
  ): Promise<HttpResponseData> => {
    const response = await invoke<HttpResponseData>('http_fetch', {
      request: {
        url,
        method: init?.method ?? 'GET',
        headers: init?.headers,
        body: init?.body,
      },
    });

    return response;
  },
};
