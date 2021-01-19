/* eslint-disable @typescript-eslint/no-explicit-any */
import * as puppeteer from 'puppeteer';
import { sleep } from '../helpers/index';
class Browser {
  private browser: puppeteer.Browser | undefined;
  private options: any;

  constructor(args: Array<string>, userDataDir?: string) {
    const options: any = {
      headless: true,
      defaultViewport: null,
      devtools: false,
      ignoreDefaultArgs: [
        '--hide-scrollbars', // show scroll bar
      ],
      args: [
        '--start-maximized',
        '--disable-web-security', //
        '--app=desired_address_without_brackets', //
        '--disable-infobars', // 
        // '--hide-scrollbars',
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-gpu',
        ...args,
      ],
    };

    if (userDataDir) {
      options.userDataDir = userDataDir;
    };

    this.options = options;
  }

  async create():Promise<puppeteer.Browser> {

    if (this.browser) {
      await this.browser.close();
    }

    // kill old browser process
    if (this.browser && this.browser.process()) {
      this.browser.process().kill();
    }

    return await this.start();
  }

  async start(): Promise<puppeteer.Browser> {
    const browser = await puppeteer.launch(this.options);
    this.browser = browser;
    return browser;
  }

  async restart(): Promise<void> {
    if (!this.browser){
      return;
    }

    await this.close();
    await this.start();
  }

  async close(): Promise<void> {
    if (!this.browser) {
      return;
    }

    await this.browser.close();
    await sleep(5000);
  }
}

export { Browser };