type ResizeObserverLike = new (callback: ResizeObserverCallback) => {
  observe(target: Element, options?: ResizeObserverOptions): void;
  unobserve(target: Element): void;
  disconnect(): void;
};

const INLINE_ATTR = 'data-test-resize-observer-inline-size';
const BLOCK_ATTR = 'data-test-resize-observer-block-size';

const parseSize = (value: string | null): number | null => {
  if (value === null) {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const buildEntry = (target: Element, inlineSize: number, blockSize: number) => {
  const size = {
    inlineSize,
    blockSize,
  } as ResizeObserverSize;
  const contentRect = {
    width: inlineSize,
    height: blockSize,
    top: 0,
    left: 0,
    bottom: blockSize,
    right: inlineSize,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRectReadOnly;
  return {
    target,
    borderBoxSize: [size],
    contentBoxSize: [size],
    contentRect,
    devicePixelContentBoxSize: [size],
  } as ResizeObserverEntry;
};

export const setupResizeObserverMock = () => {
  const g = globalThis as { ResizeObserver?: ResizeObserverLike };

  class ResizeObserverMock {
    private callback: ResizeObserverCallback;
    constructor(callback: ResizeObserverCallback) {
      this.callback = callback;
    }
    observe(target: Element, options?: ResizeObserverOptions): void {
      void options;
      const inlineAttr = parseSize(target.getAttribute(INLINE_ATTR));
      const blockAttr = parseSize(target.getAttribute(BLOCK_ATTR));
      if (inlineAttr === null && blockAttr === null) {
        return;
      }
      const inlineSize = inlineAttr ?? blockAttr ?? 0;
      const blockSize = blockAttr ?? inlineAttr ?? 0;
      const entry = buildEntry(target, inlineSize, blockSize);
      this.callback([entry], this);
    }
    unobserve(target: Element): void {
      void target; // avoid unused param lint
    }
    disconnect(): void {}
  }
  g.ResizeObserver = ResizeObserverMock;
};
