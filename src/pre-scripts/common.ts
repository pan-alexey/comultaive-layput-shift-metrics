import * as puppeteer from 'puppeteer';
import { sleep } from '../helpers';

import { IPreScript } from '../types';

const preScript: IPreScript = async (page: puppeteer.Page, client: puppeteer.CDPSession) => {
  // await page.goto('https://ozon.ru');

  await client.send('Network.setCookie', { name:'abGroup', value:'20', domain:'ozon.ru' });
  await client.send('Network.setCookie', { name:'x-o3-sitespeed-enable', value:'true', domain:'ozon.ru' });
  await sleep(1000);
};


export default preScript;