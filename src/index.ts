import { analyzer } from './core';
import { Browser } from './service/browser';
import * as path from 'path';
import * as fs from 'fs';;
import { writeFile } from './helpers';
import urls from './urls';

import reportResult from './core/report';

const browserService = new Browser(['--enable-thread-instruction-count']);
const reportPath = path.resolve(process.env.PWD, 'report/data');
if (!fs.existsSync(reportPath)){
  fs.mkdirSync(reportPath);
}

const collect = async (url: string, platform = 'mobile') => {
  console.log(`start collect [${platform}] - ${url}`);
  const browser = await browserService.create();
  const report = await analyzer(browser, url, platform);
  await browserService.close();
  console.log(`stop collect [${platform}] - ${url}`);

  const result = await reportResult(url,platform,report,reportPath);

  return result;
};

(async () => {
  const resultJson = [];
  for (let i = 0; i < urls.length; i++) {
    const [url, platform] = urls[i];
    try {
      const result = await collect(url, platform);
      resultJson.push(result);
    } catch (error) {
      console.log(error);
    }

    // save in all iteration for not to wait for all urls
    const reportJS = `window.report = ${JSON.stringify(resultJson)}`;
    await writeFile( path.resolve(reportPath, 'report.js'), reportJS);
  }


})();
