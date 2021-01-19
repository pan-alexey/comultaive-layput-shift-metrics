/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-undef */
// @ts-nocheck

module.exports = () => {
  if (!window['__performance__']) {
    window['__performance__'] = {};
  }

  window['__performance__'].context = {};

  // [FID] - First Input Delay (https://web.dev/fid/)
  (function (context, saveEntries) {
    context.FID = {};
    context.FID.value = 0;
    context.FID.entries = [];
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        context.FID.value = entry.processingStart - entry.startTime;
        if (saveEntries) {
          context.FID.entries.push(entry);
        }
      }
    });
    observer.observe({ type: 'first-input', buffered: true });
    document.addEventListener('load', () => {
      observer.disconnect();
    });
  })(window['__performance__'].context, window['__performance__'].saveEntries);

  // [CLS] - Cumulative Layout Shift (https://web.dev/cls/)
  (function (context, saveEntries) {
    context.CLS = {};
    context.CLS.value = 0;
    context.CLS.entries = [];
    const observer = new PerformanceObserver(list => {
      for (const entry of list.getEntries()) {
        if (!entry['hadRecentInput']) {
          context.CLS.value += entry['value'];

          if (saveEntries) {
            context.CLS.entries.push(entry);
          }
        }
      }
    });
    observer.observe({ type: 'layout-shift', buffered: true });
    document.addEventListener('visibilitychange', () => {
      observer.disconnect();
    });
  })(window['__performance__'].context, window['__performance__'].saveEntries);

  // [LCP] - Largest Contentful Paint (https://web.dev/lcp/)
  (function (context, saveEntries) {
    context.LCP = {};
    context.LCP.value = 0;
    context.LCP.entries = [];
    const observer = new PerformanceObserver(entryList => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        context.LCP.value = lastEntry['renderTime'] || lastEntry['loadTime'];
        if (saveEntries) {
          context.LCP.entries = [...context.LCP.entries, ...entries];
        }
    });
    observer.observe({ type: 'largest-contentful-paint', buffered: true });
    document.addEventListener('visibilitychange', function () {
        observer.disconnect();
    });
  })(window['__performance__'].context, window['__performance__'].saveEntries);

  // [LT] - Long Tasks (https://developer.mozilla.org/en-US/docs/Web/API/Long_Tasks_API)
  (function (context, saveEntries) {
    context.LT = {};
    context.LT.value = 0;
    context.LT.entries = [];

    const observer = new PerformanceObserver(function(list) {
      const entries = list.getEntries();
      context.LT.value += entries.length;
      for (let i = 0; i < entries.length; i++) {
        context.LT.entries = [...context.LT.entries, ...entries];
      }
    });
    // register observer for long task notifications
    observer.observe({ entryTypes: ['longtask'] });
  })(window['__performance__'].context, window['__performance__'].saveEntries);

  // Function for serialize PerformanceObserver data;
  // __performance__.serialize(__performance__.context)
  const serialize = (obj: any) => {
    if (obj === null || typeof (obj) != 'object') {
      return obj;
    }
    const temp: any = {};

    const htmlToString = (element) => {
      if (!(element instanceof HTMLElement)) return null;

      // get widgets name
      let widgetName = '';
      if ( element.hasAttribute('data-widget-name') ) {
        widgetName = element.getAttribute('data-widget-name');
      } else {
        const parrentElement = element.closest('[data-widget-name]');
        widgetName = parrentElement ? parrentElement.getAttribute('data-widget-name') : '';
      }

      let str = '<'+element.tagName.toLowerCase();
      for (let i = 0; i < element.attributes.length; i++) {
          const attr = element.attributes[i];
          const attrs = attr.value ? attr.name + '=' + `"${attr.value}"` : attr.name;
          str += ' ' + attrs;
      }
      str += '>';
      str += element.innerHTML;
      str += `</${element.tagName.toLowerCase()}>`;

      return {
        html: str,
        widgetName,
      };
    };

    // data-widget-name

    if (obj instanceof LayoutShift) {
      const temp = {};
      temp.value = obj.value;
      temp.sources = [];
      for (const key in obj.sources) {
        const node = htmlToString(obj.sources[key].node);
        if (!node) continue;

        temp.sources.push({
          node: htmlToString(obj.sources[key].node),
          currentRect: obj.sources[key].currentRect,
          previousRect: obj.sources[key].previousRect,
        });
      }
      return temp;
    }

    if (obj instanceof PerformanceLongTaskTiming) {
      for (const key in obj) {
        temp[key] = {};
        temp[key].duration = obj.duration;
        temp[key].entryType = obj.entryType;
        temp[key].name = obj.name;
        temp[key].startTime = obj.startTime;
        temp[key].attribution = Array.prototype.slice.call(obj.attribution);
      }
      return temp;
    }

    if (obj instanceof LargestContentfulPaint) {
      for (const key in obj) {
        temp[key] = {};
        temp[key].element = htmlToString(obj.element);
        temp[key].entryType = obj.entryType;
        temp[key].id = obj.id;
        temp[key].loadTime = obj.loadTime;
        temp[key].name = obj.name;
        temp[key].renderTime = obj.renderTime;
        temp[key].size = obj.size;
        temp[key].startTime = obj.startTime;
        temp[key].url = obj.url;
      }
      return temp;
    }

    for (const key in obj) {
      temp[key] = serialize(obj[key]);
    }
    return temp;
  };

  window['__performance__'].cslShow = () => {
    //
  };

  window['__performance__'].serialize = serialize; // for debug;
  window['__performance__'].toJSON = () => {
    return serialize(window['__performance__'].context);
  };
};
