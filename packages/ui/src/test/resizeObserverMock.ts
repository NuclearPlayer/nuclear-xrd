type ResizeObserverLike = new (callback: ResizeObserverCallback) => {
  observe(target: Element): void;
  unobserve(target: Element): void;
  disconnect(): void;
};

export const setupResizeObserverMock = () => {
  const g = globalThis as { ResizeObserver?: ResizeObserverLike };
  if (typeof g.ResizeObserver === 'undefined') {
    class ResizeObserverMock {
      constructor(callback: ResizeObserverCallback) {
        void callback; // avoid unused param lint
      }
      observe(target: Element): void {
        void target; // avoid unused param lint
      }
      unobserve(target: Element): void {
        void target; // avoid unused param lint
      }
      disconnect(): void {}
    }
    g.ResizeObserver = ResizeObserverMock;
  }
};
