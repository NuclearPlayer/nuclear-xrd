import type { LoggerHost, LogLevel } from '../types/logger';

const noopHost: LoggerHost = {
  log: () => {},
};

export class LoggerAPI {
  private host: LoggerHost;

  constructor(host?: LoggerHost) {
    this.host = host ?? noopHost;
  }

  trace(message: string): void {
    this.host.log('trace', message);
  }

  debug(message: string): void {
    this.host.log('debug', message);
  }

  info(message: string): void {
    this.host.log('info', message);
  }

  warn(message: string): void {
    this.host.log('warn', message);
  }

  error(message: string): void {
    this.host.log('error', message);
  }

  log(level: LogLevel, message: string): void {
    this.host.log(level, message);
  }
}
