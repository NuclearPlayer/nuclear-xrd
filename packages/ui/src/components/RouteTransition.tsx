import { Transition } from '@headlessui/react';
import {
  AnyRouter,
  getRouterContext,
  Outlet,
  RouterContextProvider,
  useMatch,
  useMatches,
} from '@tanstack/react-router';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useEffect, useState } from 'react';

type OutletInstance = {
  id: string;
  context: AnyRouter;
  isLeaving: boolean;
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
    <Transition
      show={!instance.isLeaving}
      appear={true}
      enter="transition-opacity duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      afterLeave={onExited}
      as="div"
      ref={ref}
      className="absolute inset-0 h-full w-full"
    >
      <RouterContextProvider router={instance.context}>
        <Outlet />
      </RouterContextProvider>
    </Transition>
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
      {outlets.map((instance) => (
        <AnimatedOutlet
          key={instance.id}
          instance={instance}
          onExited={() => handleOutletExited(instance.id)}
        />
      ))}
    </div>
  );
};
