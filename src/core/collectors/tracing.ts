/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Page } from 'puppeteer';
import { ICollectContext } from '../../types';

export const startTracing = async (page: Page): Promise<void> => {
  await page.tracing.start({
    path: '',
    screenshots: true,
    categories: [
      '-*',
      'disabled-by-default-lighthouse',
      'v8',
      'v8.execute',
      'blink.user_timing',
      'devtools.timeline',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-v8.cpu_profiler',
      'disabled-by-default-v8.cpu_profiler.hires',
      'disabled-by-default-devtools.timeline',
      'disabled-by-default-devtools.timeline.stack',
    ],
  });
};

export const stopTracing = async (page: Page, context: ICollectContext): Promise<void> => {
  const tracing = String(await page.tracing.stop());
  context.tracing = tracing;
};
