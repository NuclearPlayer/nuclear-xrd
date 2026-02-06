export type LogLevel = 'trace' | 'debug' | 'info' | 'warn' | 'error';

export type LoggerHost = {
  log: (level: LogLevel, message: string) => void;
};
