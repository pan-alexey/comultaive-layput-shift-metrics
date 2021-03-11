/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as fs from 'fs';;
import { uid, writeScreenshot, writeFile } from '../helpers';
import { IPage } from '../types';

export default async (param: IPage, report:any, reportPath:string): Promise<any> => {
  const dirName = uid();
  const dir = path.resolve(reportPath, dirName);
  fs.mkdirSync(dir);

  const trace = JSON.parse(report.trace);

  const promiseCollect = [];

  const screenTime = [];

  // Save screenshots
  const traceScreenshots = trace.traceEvents.filter(x => (
      x.cat === 'disabled-by-default-devtools.screenshot' &&
      x.name === 'Screenshot' &&
      typeof x.args !== 'undefined' &&
      typeof x.args.snapshot !== 'undefined'
  ));
  let screenshotStart = 0;
  traceScreenshots.forEach(function(snap) {
    if (!screenshotStart) screenshotStart = snap.ts;
    const progressTime = Math.floor( (snap.ts - screenshotStart)/1000);
    const img = `${progressTime}.png`;

    promiseCollect.push(writeScreenshot(path.resolve(dir, img), snap.args.snapshot.toString()));

    screenTime.push({
      img,
      progressTime,
    });
  });

  // collect write trace.js'
  promiseCollect.push(writeFile(path.resolve(dir, 'trace.json'), report.trace));
  promiseCollect.push(writeFile(path.resolve(dir, 'cls.json'), JSON.stringify({
    cls: report.cls.value,
    layoutShift: report.cls.layoutShift,
  })));

  await Promise.all(promiseCollect);

  const result = {
    date: Date.now(),
    url: param.url,
    platform: param.platform,
    dirName,
    cls: report.cls.value,
    layoutShift: report.cls.layoutShift,
    screenTime,
  };

  return result;
};
