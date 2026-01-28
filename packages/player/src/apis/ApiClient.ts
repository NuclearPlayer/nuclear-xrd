import { z } from 'zod';

export class ApiClient {
  constructor(protected readonly baseUrl: string) {}

  protected async fetch<T>(path: string, schema: z.ZodType<T>): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const json = await response.json();
    return schema.parse(json);
  }
}
