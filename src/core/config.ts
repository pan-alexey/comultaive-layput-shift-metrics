/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
const options = {
};

export const NETWORK_PRESETS = {
  'GPRS': {
    'offline': false,
    'downloadThroughput': 50 * 1024 / 8,
    'uploadThroughput': 20 * 1024 / 8,
    'latency': 500,
  },
  'Regular2G': {
    'offline': false,
    'downloadThroughput': 250 * 1024 / 8,
    'uploadThroughput': 50 * 1024 / 8,
    'latency': 300,
  },
  'Good2G': {
    'offline': false,
    'downloadThroughput': 450 * 1024 / 8,
    'uploadThroughput': 150 * 1024 / 8,
    'latency': 150,
  },
  'Regular3G': {
    'offline': false,
    'downloadThroughput': 750 * 1024 / 8,
    'uploadThroughput': 250 * 1024 / 8,
    'latency': 100,
  },
  'Good3G': {
    'offline': false,
    'downloadThroughput': 1.5 * 1024 * 1024 / 8,
    'uploadThroughput': 750 * 1024 / 8,
    'latency': 40,
  },
  'Regular4G': {
    'offline': false,
    'downloadThroughput': 4 * 1024 * 1024 / 8,
    'uploadThroughput': 3 * 1024 * 1024 / 8,
    'latency': 20,
  },
  'DSL': {
    'offline': false,
    'downloadThroughput': 2 * 1024 * 1024 / 8,
    'uploadThroughput': 1 * 1024 * 1024 / 8,
    'latency': 5,
  },
  'WiFi': {
    'offline': false,
    'downloadThroughput': 30 * 1024 * 1024 / 8,
    'uploadThroughput': 15 * 1024 * 1024 / 8,
    'latency': 2,
  },
};

export const getPlatform = (platform?: string) => {
  const desktop = {
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.121 Safari/537.36',
    viewport: {
      width: 1920,
      height: 1080,
    },
    options,
  };

  const mobile = {
    userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; DUB-LX3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.105 Mobile Safari/537.36',
    viewport: {
      width: 360,
      height: 640,
    },
    options,
  };

  return platform === 'desktop' ? desktop : mobile;
};
