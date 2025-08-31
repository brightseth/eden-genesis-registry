'use client'

import React, { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  }

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('React Error Boundary caught an error:', error, errorInfo)
  }

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen bg-black text-white p-8 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold uppercase mb-4">COMPONENT ERROR</h1>
            <p className="opacity-70 mb-4">Something went wrong rendering this component</p>
            <button 
              onClick={() => this.setState({ hasError: false })}
              className="border border-white px-4 py-2 hover:bg-white hover:text-black transition-colors uppercase tracking-wide"
            >
              RETRY
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}