
import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

// ErrorBoundary component to catch UI crashes and show a fallback view.
// Fix: Explicitly extend React.Component to ensure the 'props' property is correctly inherited and recognized by the TypeScript compiler.
export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="h-screen w-screen flex flex-col items-center justify-center p-8 text-center bg-slate-900 text-white">
          <div className="text-6xl mb-4">😵‍💫</div>
          <h1 className="text-2xl font-bold mb-2">Something went wrong.</h1>
          <p className="text-slate-400 text-sm mb-6 max-w-xs">
            {this.state.error?.message || 'An unexpected error occurred in the Aura UI.'}
          </p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-white text-slate-900 rounded-2xl font-bold active:scale-95 transition-transform"
          >
            Reload App
          </button>
        </div>
      );
    }

    // Access children through this.props.
    return this.props.children;
  }
}
