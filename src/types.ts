import * as puppeteer from 'puppeteer';
export interface ICollectContext {
  windowMetrics: {
    performance: unknown;
    entries: unknown;
    perfomanceObserver: unknown;
  };
  tracing: string
}

export type IPreScript = (page: puppeteer.Page, client: puppeteer.CDPSession) => Promise<void>;

export interface IPage {
  url: string;
  headers?: {
    [key: string] : string
  };
  proxy?: string;
  basicAuth?: {
    username: string,
    password: string,
  };
  platform?: 'desktop' | 'mobile';
  network?: 'GPRS' | 'Slow2G' | 'Good2G' | 'Slow3G' | '3G' | '4G' | 'WiFi';
  cpuThrottling?: 4 | 6;
  preScritp?: IPreScript;
}
