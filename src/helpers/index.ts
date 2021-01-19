/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as fs from 'fs';


/* eslint-disable @typescript-eslint/ban-types */
export const sleep = (ms: number, arg?: unknown): Promise<unknown> => {
  return new Promise((resolve) => setTimeout(() => {
    resolve(arg);
  }, ms));
};

export const awaitTimeout = (callback: Promise<unknown>, timeout = 180000): Promise<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  result: any, error: any
}> => {
  // eslint-disable-next-line no-async-promise-executor
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      resolve({ result: null, error: 'Timeout Error' });
    }, timeout);

    callback.then((result) => {
      resolve({ result, error: null });
    }).catch((error) => {
      resolve({ result: null, error });
    }).finally(() => {
      clearTimeout(timer);
    });
  });
};

export const uid = (prefix = '', postfix = '', radix = 10): string => {
  const uid = Date.now().toString(radix);
  return `${prefix}${uid}${postfix}`;
};

export const ObjetDiff = (a: Object, b: Object): Object => {
  const result = {};

  for (const key in a) {
    if (Object.prototype.hasOwnProperty.call(b, key)) {
      result[key] = a[key] - b[key];
    }
  }

  return result;
};

export const writeScreenshot = async (path: string, blob: any): Promise<void> => {
  return new Promise((resolve, reject)=>{
    fs.writeFile(path, blob,  'base64', function(err) {
      if (err) {
        reject(err);
      } 
      else {
        resolve();
      }
    });
  });
};

export const writeFile = async (path: string, blob: any): Promise<void> => {
  return new Promise((resolve, reject)=>{
    fs.writeFile(path, blob, function(err) {
      if (err) {
        reject(err);
      } 
      else {
        resolve();
      }
    });
  });
};