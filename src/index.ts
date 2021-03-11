import { analyzer } from './core';
import { Browser } from './service/browser';
import * as path from 'path';
import * as fs from 'fs';;
import { writeFile } from './helpers';
import urls from './urls';

import reportResult from './core/report';
import { IPage } from './types';

const reportPath = path.resolve(process.env.PWD, 'report/data');
if (!fs.existsSync(reportPath)){
  fs.mkdirSync(reportPath);
}

const collect = async (page: IPage) => {

  // Sanitize platform
  page.platform = page.platform === 'desktop' ? 'desktop' : 'mobile';

  // Arguments
  const chromeArg = [];
  if (page.proxy) {
    chromeArg.push(`--proxy-server=${page.proxy}`);
  }
  const browserService = new Browser(chromeArg);
  console.log(`start collect [${page.platform}] - ${page.url}`);

  const browser = await browserService.create();
  const report = await analyzer(browser, page);
  await browserService.close();
  console.log(`stop collect [${page.platform}] - ${page.url}`);

  const result = await reportResult(page ,report,reportPath);

  return result;
};

(async () => {
  const resultJson = [];
  for (let i = 0; i < urls.length; i++) {
    const page: IPage = urls[i];
    try {
      const result = await collect(page);
      resultJson.push(result);
    } catch (error) {
      console.log(error);
    }

    // save in all iteration for not to wait for all urls
    const reportJS = `window.report = ${JSON.stringify(resultJson)}`;
    await writeFile( path.resolve(reportPath, 'report.js'), reportJS);
  }


})();
