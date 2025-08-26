import { getRouterContext, Outlet, useMatches } from '@tanstack/react-router';
import { AnimatePresence, motion, useIsPresent } from 'framer-motion';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useRef } from 'react';

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

// See https://github.com/TanStack/router/discussions/823#discussioncomment-8535087
const AnimatedOutlet = forwardRef<HTMLDivElement>((_, ref) => {
  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);
  const renderedContext = useRef(routerContext);
  const isPresent = useIsPresent();

  if (isPresent) {
    const clone = cloneDeep(routerContext);
    clone.options.context = routerContext.options.context;
    renderedContext.current = clone;
  }

  return (
    <motion.div
      ref={ref}
      className="absolute inset-0 h-full w-full"
      variants={slideVariants}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{
        type: 'spring',
        stiffness: 400,
        damping: 30,
        mass: 0.8,
      }}
    >
      <RouterContext.Provider value={renderedContext.current}>
        <Outlet />
      </RouterContext.Provider>
    </motion.div>
  );
});

export const RouteTransition = () => {
  const matches = useMatches();
  const leafMatchId = matches[matches.length - 1]?.id ?? 'root';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="popLayout" initial={false}>
        <AnimatedOutlet key={leafMatchId} />
      </AnimatePresence>
    </div>
  );
};
