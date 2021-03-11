/* eslint-disable @typescript-eslint/no-explicit-any */
import * as puppeteer from 'puppeteer';
import * as coreConfig from './config';
import { IPage } from '../types';
import * as fs from 'fs';
import { sleep } from '../helpers';

import { ICollectContext } from '../types';

import { startWindowMetrics, stopWindowMetrics } from './collectors/window-metrics';
import { startTracing, stopTracing } from './collectors/tracing';

import { normalizeCls } from './metrics/cls';

export const analyzer =  async (browser: puppeteer.Browser, param: IPage): Promise<any> => {
  // create page by platform;
  const config = coreConfig.getPlatform(param.platform);
  const page: puppeteer.Page = (await browser.pages())[0];

  const client = await page.target().createCDPSession();
  await page.setViewport(config.viewport);
  await page.setUserAgent(config.userAgent);
  await page.setCacheEnabled(false);

  // basic auth
  if (param.basicAuth) {
    await page.authenticate(param.basicAuth);
  }

  if (param.preScritp) {
    await param.preScritp(page, client);
  }

  // Set throttling property
  if(param.network) {
    await client.send('Network.emulateNetworkConditions', coreConfig.NETWORK_PRESETS[param.network]);
  }

  if(param.cpuThrottling) {
    await client.send('Emulation.setCPUThrottlingRate', { rate: param.cpuThrottling });
  }

  // show LayoutShiftRegions
  await client.send('Overlay.setShowLayoutShiftRegions', {
    result: true,
  });

  await page.goto('about:blank');

  await client.send('Emulation.clearDeviceMetricsOverride');
  await client.send('Network.clearBrowserCache');
  await client.send('Storage.clearDataForOrigin', {
    origin: '*',
    storageTypes: 'all',
  });

  await client.send('Network.setCacheDisabled', {
    cacheDisabled: false,
  });


  // interceptor
  await page.on('request', async (request: puppeteer.Request ) => {

    // // Drop req by url patern
    // const url: string = await request.url();
    // const condition = url.toLowerCase().includes('o3.ru');
    // if ( condition ) {
    //   request.abort();
    //   return;
    // }

    // add extra heders
    const requestHeaders = await request.headers();
    const headers = param.headers ? Object.assign({}, requestHeaders, param.headers) : requestHeaders;
    
    // intecept with extra headers
    await request.continue({
      headers,
    });
  });
  await page.setRequestInterception(true);


  await startWindowMetrics(page);

  await startTracing(page);
  await page.goto(param.url);
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

