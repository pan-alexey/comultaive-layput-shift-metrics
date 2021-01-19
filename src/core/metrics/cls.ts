/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { ObjetDiff } from '../../helpers';

export const normalizeCls = (CLS: any): any => {
  const result = [];
  const { entries } = CLS;

  for (const key in entries) {
    const { sources, value } = entries[key] as any;

    const layoutShift: any = {};
    layoutShift.value = value;

    layoutShift.widgets = [];

    sources.forEach(element => {
      layoutShift.widgets.push({
        ...element.node,
        shift: ObjetDiff(element.previousRect, element.currentRect),
      });
    });
    if (layoutShift.widgets.length >= 1) {
      result.push(layoutShift);
    }
  }

  return result;
};
