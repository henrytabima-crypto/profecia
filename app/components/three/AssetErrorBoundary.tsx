"use client";

import { Component, type ReactNode } from "react";

type AssetErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
  onError?: (error: Error) => void;
};

type AssetErrorBoundaryState = {
  failed: boolean;
};

/**
 * Keeps an optional 3D asset failure inside the R3F tree so the surrounding
 * experience can report it without crashing the page.
 */
export default class AssetErrorBoundary extends Component<AssetErrorBoundaryProps, AssetErrorBoundaryState> {
  state: AssetErrorBoundaryState = { failed: false };

  static getDerivedStateFromError(): AssetErrorBoundaryState {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
