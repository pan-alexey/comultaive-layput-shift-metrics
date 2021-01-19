import * as puppeteer from 'puppeteer';
import { ICollectContext } from '../../types';

export const startWindowMetrics = async (page: puppeteer.Page): Promise<void> => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const collectWindowMetrics = require('./scripts/window-performance');

  await Promise.all([
    page.evaluateOnNewDocument(()=>{
      window['__performance__'] = {};
    }),
    page.evaluateOnNewDocument(()=>{
      window['__performance__'] = {};
      window['__performance__'].saveEntries = true;
    }),
  ]);

  await Promise.all([
    page.evaluateOnNewDocument(collectWindowMetrics),
    page.evaluate(collectWindowMetrics),
  ]);
};

export const stopWindowMetrics = async (page: puppeteer.Page, context: ICollectContext): Promise<void> => {
  const [performance, entries, perfomanceObserver] = await Promise.all([
    page.evaluate(() => JSON.stringify(window.performance)),
    page.evaluate(() => JSON.stringify(window.performance.getEntries())),
    page.evaluate(() => {
      if (window['__performance__']) {
         return JSON.stringify(window['__performance__'].toJSON());
      }
      return JSON.stringify(null);
    }),
  ]);

  context.windowMetrics = {
    performance: JSON.parse(performance),
    entries: JSON.parse(entries),
    perfomanceObserver: JSON.parse(perfomanceObserver),
  };
};
