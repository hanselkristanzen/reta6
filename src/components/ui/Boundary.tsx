import { Component, type ReactNode } from "react";

interface BoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Keeps a purely decorative part (a WebGL background) from taking the page down with it: if it
 * throws, for example because the browser has no WebGL, it is replaced by the fallback and the
 * content around it carries on.
 */
export class Boundary extends Component<BoundaryProps, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  render() {
    return this.state.failed ? (this.props.fallback ?? null) : this.props.children;
  }
}
