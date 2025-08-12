import {
  AnyRouter,
  getRouterContext,
  Outlet,
  RouterContextProvider,
  useMatch,
  useMatches,
} from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useEffect, useState } from 'react';

type OutletInstance = {
  id: string;
  context: AnyRouter;
  isLeaving: boolean;
};

const SLIDE_DISTANCE = 24;
const SCALE_FACTOR = 0.96;

const slideVariants = {
  enter: {
    x: SLIDE_DISTANCE,
    scale: SCALE_FACTOR,
    opacity: 0,
    filter: 'blur(4px)',
  },
  center: {
    x: 0,
    scale: 1,
    opacity: 1,
    filter: 'blur(0px)',
  },
  exit: {
    x: -SLIDE_DISTANCE,
    scale: SCALE_FACTOR,
    opacity: 0,
    filter: 'blur(4px)',
  },
};

const AnimatedOutlet = forwardRef<
  HTMLDivElement,
  {
    instance: OutletInstance;
    onExited: () => void;
  }
>((props, ref) => {
  const { instance, onExited } = props;

  return (
    <motion.div
      key={instance.id}
      ref={ref}
      className="absolute inset-0 h-full w-full"
      variants={slideVariants}
      initial="enter"
      animate={instance.isLeaving ? 'exit' : 'center'}
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
      onAnimationComplete={() => {
        if (instance.isLeaving) {
          onExited();
        }
      }}
    >
      <RouterContextProvider router={instance.context}>
        <Outlet />
      </RouterContextProvider>
    </motion.div>
  );
});

export const RouteTransition = () => {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const matchIndex = matches.findIndex((d) => d.id === match.id);
  const nextMatchIndex =
    matchIndex === matches.length - 1 ? matchIndex : matchIndex + 1;
  const nextMatch = matches[nextMatchIndex];

  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);

  const [outlets, setOutlets] = useState<OutletInstance[]>(() => {
    const clone = cloneDeep(routerContext);
    clone.options.context = routerContext.options.context;
    return [
      {
        id: nextMatch.id,
        context: clone,
        isLeaving: false,
      },
    ];
  });

  useEffect(() => {
    const currentOutlet = outlets.find((o) => !o.isLeaving);
    if (!currentOutlet || currentOutlet.id !== nextMatch.id) {
      setOutlets((prev) =>
        prev.map((outlet) => ({ ...outlet, isLeaving: true })),
      );

      const clone = cloneDeep(routerContext);
      clone.options.context = routerContext.options.context;

      setOutlets((prev) => [
        ...prev,
        {
          id: nextMatch.id,
          context: clone,
          isLeaving: false,
        },
      ]);
    }
  }, [nextMatch.id, routerContext]);

  const handleOutletExited = (instanceId: string) => {
    setOutlets((prev) => prev.filter((outlet) => outlet.id !== instanceId));
  };

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout">
        {outlets.map((instance) => (
          <AnimatedOutlet
            key={instance.id}
            instance={instance}
            onExited={() => handleOutletExited(instance.id)}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
