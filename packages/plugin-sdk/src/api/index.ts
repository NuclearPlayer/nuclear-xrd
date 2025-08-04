export class NuclearPluginAPI {
  async ping(): Promise<string> {
    return Promise.resolve("pong");
  }
}
