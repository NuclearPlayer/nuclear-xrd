import { Transition } from '@headlessui/react';
import {
  getRouterContext,
  Outlet,
  RouterContextProvider,
  useMatch,
  useMatches,
} from '@tanstack/react-router';
import { cloneDeep } from 'lodash-es';
import { forwardRef, useContext, useRef } from 'react';

export const RouteTransition = () => {
  const matches = useMatches();
  const match = useMatch({ strict: false });
  const matchIndex = matches.findIndex((d) => d.id === match.id);
  const nextMatchIndex =
    matchIndex === matches.length - 1 ? matchIndex : matchIndex + 1;
  const nextMatch = matches[nextMatchIndex];

  const RouterContext = getRouterContext();
  const routerContext = useContext(RouterContext);
  const renderedContext = useRef(routerContext);
  const isPresent = useRef(true);

  if (isPresent.current) {
    const clone = cloneDeep(routerContext);
    clone.options.context = routerContext.options.context;
    renderedContext.current = clone;
  }

  const TransitionContent = forwardRef<HTMLDivElement>((props, ref) => (
    <div ref={ref} {...props}>
      <RouterContextProvider router={renderedContext.current}>
        <Outlet />
      </RouterContextProvider>
    </div>
  ));

  return (
    <Transition
      show={true}
      appear={true}
      key={nextMatch.pathname}
      enter="transition-opacity duration-200 ease-out"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-150 ease-in"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
      beforeEnter={() => {
        isPresent.current = true;
      }}
      beforeLeave={() => {
        isPresent.current = false;
      }}
      as={TransitionContent}
    />
  );
};
