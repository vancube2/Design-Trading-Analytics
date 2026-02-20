import { Component } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

interface Props {
    children: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
        error: null
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
                <div className="p-8 bg-surface-card border border-secondary-bear/30 rounded-2xl text-center">
                    <h2 className="text-xl font-bold text-secondary-bear mb-2">Something went wrong</h2>
                    <p className="text-text-secondary text-sm mb-4">
                        A component failed to render. We've logged the error.
                    </p>
                    <pre className="text-xs bg-bg-dark p-4 rounded-lg overflow-auto max-h-40 text-left text-secondary-bear/70 font-mono">
                        {this.state.error?.message}
                    </pre>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 px-6 py-2 bg-accent-purple rounded-lg font-bold"
                    >
                        Reload Dashboard
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
