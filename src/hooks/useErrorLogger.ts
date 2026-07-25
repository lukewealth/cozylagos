import { useCallback } from 'react';

export interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  category: string;
  message: string;
  stack?: string;
  context?: Record<string, any>;
  url: string;
  userAgent: string;
}

export function useErrorLogger() {
  const logError = useCallback((
    category: string,
    message: string,
    error?: Error,
    context?: Record<string, any>
  ) => {
    const errorLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      category,
      message,
      stack: error?.stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    // Log to console
    console.error(`[${category}] ${message}`, error, context);

    // Save to localStorage
    const existingErrors = JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
    existingErrors.push(errorLog);
    
    // Keep only last 100 errors
    if (existingErrors.length > 100) {
      existingErrors.shift();
    }
    
    localStorage.setItem('cozy_lagos_error_log', JSON.stringify(existingErrors));
  }, []);

  const logWarning = useCallback((
    category: string,
    message: string,
    context?: Record<string, any>
  ) => {
    const warningLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      category,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.warn(`[${category}] ${message}`, context);

    const existingLogs = JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
    existingLogs.push(warningLog);
    
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    
    localStorage.setItem('cozy_lagos_error_log', JSON.stringify(existingLogs));
  }, []);

  const logInfo = useCallback((
    category: string,
    message: string,
    context?: Record<string, any>
  ) => {
    const infoLog: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      category,
      message,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    console.log(`[${category}] ${message}`, context);

    const existingLogs = JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
    existingLogs.push(infoLog);
    
    if (existingLogs.length > 100) {
      existingLogs.shift();
    }
    
    localStorage.setItem('cozy_lagos_error_log', JSON.stringify(existingLogs));
  }, []);

  const getErrorLogs = useCallback((): ErrorLog[] => {
    return JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
  }, []);

  const clearErrorLogs = useCallback(() => {
    localStorage.removeItem('cozy_lagos_error_log');
  }, []);

  return {
    logError,
    logWarning,
    logInfo,
    getErrorLogs,
    clearErrorLogs
  };
}
