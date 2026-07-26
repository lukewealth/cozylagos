/**
 * Centralized Logger Utility
 * Replaces console.log/error/warn with structured logging
 * Supports different log levels for dev vs production
 */

export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  category: string;
  message: string;
  data?: any;
  error?: Error;
}

class Logger {
  private static instance: Logger;
  private logBuffer: LogEntry[] = [];
  private maxBufferSize = 1000;
  private isProduction = import.meta.env.PROD;

  private constructor() {}

  static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  debug(category: string, message: string, data?: any): void {
    this.log('debug', category, message, data);
  }

  info(category: string, message: string, data?: any): void {
    this.log('info', category, message, data);
  }

  warn(category: string, message: string, data?: any): void {
    this.log('warn', category, message, data);
  }

  error(category: string, message: string, error?: Error | any, data?: any): void {
    this.log('error', category, message, data, error instanceof Error ? error : undefined);
  }

  private log(level: LogLevel, category: string, message: string, data?: any, error?: Error): void {
    // Skip debug logs in production
    if (this.isProduction && level === 'debug') {
      return;
    }

    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      category,
      message,
      data,
      error,
    };

    // Add to buffer
    this.logBuffer.push(entry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }

    // Console output (only in development or for warnings/errors in production)
    if (!this.isProduction || level === 'warn' || level === 'error') {
      const prefix = `[${level.toUpperCase()}] [${category}]`;
      
      switch (level) {
        case 'debug':
          console.debug(prefix, message, data || '');
          break;
        case 'info':
          console.info(prefix, message, data || '');
          break;
        case 'warn':
          console.warn(prefix, message, data || '');
          break;
        case 'error':
          console.error(prefix, message, error || data || '');
          break;
      }
    }

    // In production, send errors to monitoring service
    if (this.isProduction && level === 'error') {
      this.sendToMonitoring(entry);
    }
  }

  private sendToMonitoring(entry: LogEntry): void {
    // TODO: Integrate with error monitoring service (Sentry, LogRocket, etc.)
    // For now, store in localStorage for debugging
    try {
      const errorLogs = JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
      errorLogs.push({
        ...entry,
        error: entry.error ? {
          message: entry.error.message,
          stack: entry.error.stack,
        } : undefined,
      });
      
      // Keep only last 50 errors
      if (errorLogs.length > 50) {
        errorLogs.shift();
      }
      
      localStorage.setItem('cozy_lagos_error_log', JSON.stringify(errorLogs));
    } catch (e) {
      // Silently fail - don't let logging errors crash the app
    }
  }

  getLogBuffer(): LogEntry[] {
    return [...this.logBuffer];
  }

  clearLogBuffer(): void {
    this.logBuffer = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logBuffer, null, 2);
  }
}

// Export singleton instance
export const logger = Logger.getInstance();

// Convenience methods
export const log = {
  debug: (category: string, message: string, data?: any) => logger.debug(category, message, data),
  info: (category: string, message: string, data?: any) => logger.info(category, message, data),
  warn: (category: string, message: string, data?: any) => logger.warn(category, message, data),
  error: (category: string, message: string, error?: Error | any, data?: any) => logger.error(category, message, error, data),
};

export default logger;
