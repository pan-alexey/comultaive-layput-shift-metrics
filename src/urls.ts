import { IPage } from './types';

import commonPreScript from './pre-scripts/common';

const pages: Array<IPage> = [
  {
    url: 'https://www.ozon.ru',
    platform: 'desktop',
    network: '3G',
    preScritp: commonPreScript,
  },
  {
    url: 'https://www.ozon.ru',
    platform: 'desktop',
    cpuThrottling: 6,
    network: '3G',
    preScritp: commonPreScript,
  },
];


export default pages;