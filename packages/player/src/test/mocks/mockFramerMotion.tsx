import { ElementType, forwardRef, ReactNode } from 'react';

export const createFramerMotionMock = (mod: typeof import('framer-motion')) => {
  const make = (Tag: ElementType) =>
    forwardRef<unknown, { children?: ReactNode } & Record<string, unknown>>(
      ({ children, className, animate, exit, initial, transition }, ref) => {
        const Comp = Tag as ElementType;
        return (
          <Comp
            ref={ref}
            className={className}
            animate={animate}
            exit={exit}
            initial={initial}
            transition={transition}
          >
            {children}
          </Comp>
        );
      },
    );

  const motion = new Proxy(
    {},
    {
      get: (_target, el: string) => make(el as unknown as ElementType),
    },
  ) as typeof mod.motion;

  const AnimatePresence = ({ children }: { children?: ReactNode }) => (
    <>{children}</>
  );

  const MotionConfig = ({ children }: { children?: ReactNode }) => (
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

export default createFramerMotionMock;
