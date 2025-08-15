import React from 'react';

export const createFramerMotionMock = (mod: typeof import('framer-motion')) => {
  const make = (Tag: React.ElementType) =>
    React.forwardRef<unknown, Record<string, unknown>>((props, ref) => {
      const { children, ...rest } = props as {
        children?: React.ReactNode;
      } & Record<string, unknown>;
      return React.createElement(Tag, { ref, ...rest }, children);
    });

  const motion = new Proxy(
    {},
    {
      get: (_target, el: string) => make(el as unknown as React.ElementType),
    },
  ) as typeof mod.motion;

  const AnimatePresence = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  const MotionConfig = ({ children }: { children?: React.ReactNode }) => (
    <>{children}</>
  );

  return {
    ...mod,
    motion,
    AnimatePresence,
    MotionConfig,
    useReducedMotion: () => true,
    MotionGlobalConfig: { ...mod.MotionGlobalConfig, skipAnimations: true },
  } as typeof import('framer-motion');
};
