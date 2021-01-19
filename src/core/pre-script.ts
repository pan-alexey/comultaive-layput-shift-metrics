import * as puppeteer from 'puppeteer';
import { sleep } from '../helpers';

export default async (page: puppeteer.Page, client: puppeteer.CDPSession): Promise<void> => {
  console.log('prescript start');

  await page.goto('https://passport.yandex.ru');

  await page.type('form input[name="login"]', 'user', { delay: 20 });

  await page.click('form button[type="submit"]');

  await page.waitForSelector('form input[name="passwd"]');

  await page.type('form input[name="passwd"]', 'password', { delay: 20 });

  await page.waitForSelector('form button[type="submit"]');

  await page.click('form button[type="submit"]');

  try {
    await sleep(2000);
    const validateSecondEmail = await page.evaluate(() => JSON.stringify(Boolean(document.querySelectorAll('input[name="email"]'))));
    if (validateSecondEmail) {
      await page.type('input[name="email"]', 'usery@yandex.ru', { delay: 20 });
      await page.click('form button[type="submit"]');
    }
  } catch (error) {
    //
  }

  await sleep(2000);

  await client.send('Network.setCookie', { name:'ymp-onboarding-popup-was-shown', value:'1', domain:'m.pokupki.market.yandex.ru' });
  await client.send('Network.setCookie', { name:'font-balloon-loaded', value:'1', domain:'m.pokupki.market.yandex.ru' });
  await client.send('Network.setCookie', { name:'smrtbnr', value:'1', domain:'m.pokupki.market.yandex.ru' });

  await client.send('Network.setCookie', { name:'ymp-onboarding-popup-was-shown', value:'1', domain:'pokupki.market.yandex.ru' });
  await client.send('Network.setCookie', { name:'font-balloon-loaded', value:'1', domain:'pokupki.market.yandex.ru' });
  await client.send('Network.setCookie', { name:'smrtbnr', value:'1', domain:'pokupki.market.yandex.ru' });

  await client.send('Network.setCookie', { name:'o_cdm', value:'1582721930425', domain:'ozon.ru' });
  await client.send('Network.setCookie', { name:'abGroup', value:'20', domain:'ozon.ru' });
  await client.send('Network.setCookie', { name:'x-o3-sitespeed-enable', value:'true', domain:'ozon.ru' });
  await client.send('Network.setCookie', { name:'x-o3-auto-modal-off', value:'true', domain:'ozon.ru' });


  console.log('prescript end');
};
