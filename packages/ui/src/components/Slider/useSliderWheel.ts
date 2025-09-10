import { useCallback, useEffect, useRef } from 'react';

export const useSliderWheel = (
  ref: React.RefObject<HTMLElement>,
  opts: {
    disabled?: boolean;
    get: () => { value: number; step: number; min: number; max: number };
    set: (next: number) => void;
  },
) => {
  const getRef = useRef(opts.get);
  const setRef = useRef(opts.set);

  useEffect(() => {
    getRef.current = opts.get;
    setRef.current = opts.set;
  }, [opts.get, opts.set]);

  const onWheel = useCallback(
    (event: WheelEvent) => {
      if (opts.disabled) {
        return;
      }
      event.preventDefault();
      event.stopPropagation();
      const { value, step, min, max } = getRef.current();
      const dir = event.deltaY < 0 ? 1 : -1;
      const next = value + dir * step;
      const clamped = Math.min(Math.max(next, min), max);
      setRef.current(clamped);
    },
    [opts.disabled],
  );

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.addEventListener('wheel', onWheel, { passive: false, capture: true });
    return () => {
      el.removeEventListener('wheel', onWheel as EventListener, true);
    };
  }, [onWheel, ref]);
};
