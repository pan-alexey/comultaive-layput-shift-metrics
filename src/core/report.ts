/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as path from 'path';
import * as fs from 'fs';;
import { uid, writeScreenshot, writeFile } from '../helpers';


export default async (url: string, platform: string, report:any, reportPath:string): Promise<any> => {
  const dirName = uid();
  const dir = path.resolve(reportPath, dirName);
  fs.mkdirSync(dir);

  const trace = JSON.parse(report.trace);

  const promiceCollect = [];


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

    promiceCollect.push(writeScreenshot(path.resolve(dir, img), snap.args.snapshot.toString()));

    screenTime.push({
      img,
      progressTime,
    });
  });

  // // collect write trace.js'
  promiceCollect.push(writeFile(path.resolve(dir, 'trace.json'), report.tracing));
  promiceCollect.push(writeFile(path.resolve(dir, 'cls.json'), JSON.stringify({
    cls: report.cls.value,
    layoutShift: report.cls.layoutShift,
  })));

  await Promise.all(promiceCollect);

  const result = {
    date: Date.now(),
    url,
    platform,
    dirName,
    cls: report.cls.value,
    layoutShift: report.cls.layoutShift,
    screenTime,
  };

  return result;
};
