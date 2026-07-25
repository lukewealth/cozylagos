import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
      errorInfo: null
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      error,
      errorInfo
    });

    // Log error to console
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    // Log error to localStorage for tracking
    const errorLog = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent
    };

    const existingErrors = JSON.parse(localStorage.getItem('cozy_lagos_error_log') || '[]');
    existingErrors.push(errorLog);
    
    // Keep only last 50 errors
    if (existingErrors.length > 50) {
      existingErrors.shift();
    }
    
    localStorage.setItem('cozy_lagos_error_log', JSON.stringify(existingErrors));
  }

  handleRetry = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null
    });
  };

  handleClearErrors = () => {
    localStorage.removeItem('cozy_lagos_error_log');
    console.log('Error log cleared');
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center bg-parchment p-4">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="font-serif text-2xl font-bold text-charcoal mb-2">
              Something went wrong
            </h2>
            <p className="text-sm text-charcoal/60 mb-6">
              {this.state.error?.message || 'An unexpected error occurred'}
            </p>
            <div className="flex gap-3">
              <button
                onClick={this.handleRetry}
                className="flex-1 px-4 py-2 bg-gold text-charcoal font-bold text-xs uppercase rounded-lg hover:bg-gold-dark transition-all"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="flex-1 px-4 py-2 bg-charcoal text-parchment font-bold text-xs uppercase rounded-lg hover:bg-charcoal/80 transition-all"
              >
                Reload Page
              </button>
            </div>
            <button
              onClick={this.handleClearErrors}
              className="mt-4 text-xs text-charcoal/40 hover:text-charcoal/60 transition-colors"
            >
              Clear Error Log
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
