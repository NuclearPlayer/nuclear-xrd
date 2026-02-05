import '@testing-library/jest-dom';

import { MotionGlobalConfig } from 'framer-motion';

import { setupResizeObserverMock } from './resizeObserverMock';

process.env.TZ = 'UTC';

setupResizeObserverMock();

MotionGlobalConfig.skipAnimations = true;
MotionGlobalConfig.instantAnimations = true;

vi.mock('framer-motion', async (importOriginal) => {
  const mod = await importOriginal<typeof import('framer-motion')>();
  const mockMod = await import('./mockFramerMotion');
  const factory = mockMod.createFramerMotionMock;
  return factory(mod);
});
