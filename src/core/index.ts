/* eslint-disable @typescript-eslint/no-explicit-any */
import * as puppeteer from 'puppeteer';
import * as coreConfig from './config';
import * as fs from 'fs';
import preScript from './pre-script';
import { sleep } from '../helpers';

import { ICollectContext } from '../types';

import { startWindowMetrics, stopWindowMetrics } from './collectors/window-metrics';
import { startTracing, stopTracing } from './collectors/tracing';

import { normalizeCls } from './metrics/cls';

export const analyzer =  async (browser: puppeteer.Browser, url: string, platform: string): Promise<any> => {
  // create page by platform;
  const config = coreConfig.getPlatform(platform);
  const page: puppeteer.Page = (await browser.pages())[0];

  const client = await page.target().createCDPSession();
  await page.setViewport(config.viewport);
  await page.setUserAgent(config.userAgent);
  await page.setCacheEnabled(false);

  await client.send('Emulation.clearDeviceMetricsOverride');
  await client.send('Network.setCacheDisabled', {
    cacheDisabled: true,
  });

  // Set throttling property
  await client.send('Network.emulateNetworkConditions', coreConfig.NETWORK_PRESETS.Good3G);

  // PRE SCRIPT IF NEEDED
  //await preScript(page, client); // ++++++++++++++++++++++++++++

  // show LayoutShiftRegions
  await client.send('Overlay.setShowLayoutShiftRegions', {
    result: true,
  });

  await page.goto('about:blank');
  await client.send('Network.clearBrowserCache');
  await client.send('Storage.clearDataForOrigin', {
    origin: '*',
    storageTypes: 'all',
  });

  // interceptor
  await page.on('request', async (request: puppeteer.Request ) => {
    
    // // drop ulr by patern
    // const url: string = await request.url();
    // const condition = url.toLowerCase().includes('example.com');
    // if ( condition ) {
    //   request.abort();
    //   return;
    // }

    // add extra heders
    const headers = await request.headers();

    // intecept with extra headers
    await request.continue({
      headers,
    });
  });
  await page.setRequestInterception(true);


  await startWindowMetrics(page);

  await startTracing(page);
  await page.goto(url);
  await page.waitForTimeout(5000);

  // create context
  const context: ICollectContext = {} as ICollectContext;
  await stopTracing(page, context);
  await stopWindowMetrics(page, context);

  // get cls
  const { CLS } = context.windowMetrics.perfomanceObserver as any;

  return {
    cls: {
      value: CLS.value,
      layoutShift: normalizeCls(CLS),
    },
    trace: context.tracing,
  };
};

