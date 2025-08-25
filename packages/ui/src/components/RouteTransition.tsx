import { Outlet, useMatches } from '@tanstack/react-router';
import { AnimatePresence, motion } from 'framer-motion';

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

export const RouteTransition = () => {
  const matches = useMatches();
  const leafMatchId = matches[matches.length - 1]?.id ?? 'root';

  return (
    <div className="relative h-full w-full overflow-hidden">
      <AnimatePresence mode="sync" initial={false}>
        <motion.div
          key={leafMatchId}
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
          <Outlet />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
