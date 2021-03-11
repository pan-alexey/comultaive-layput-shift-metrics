## puppeteer-metrics


## Команда для запуска 
```
npm run start
```


## Файл отчета находится тут
```
./report/index.html
```

## Список урлов для проверки находится в файле
```
./src/urls.ts
```

## Описание интерфейса
```
  url: string;
  headers?: { // Заголовки для запроса
    [key: string] : string
  };
  proxy?: string; // адрес прокси формата http://domain.com:port
  basicAuth?: { // Http авторизация для proxy или запроса
    username: string,
    password: string,
  };
  platform?: 'desktop' | 'mobile';
  network?: 'GPRS' | 'Slow2G' | 'Good2G' | 'Slow3G' | '3G' | '4G' | 'WiFi'; // Тип сети
  cpuThrottling?: 4 | 6; // Тротлинг CPU (см. вкладка perfomance cpu)
  preScritp?: IPreScript; // Сценарий, выполняющйся до запуска тестов.
```

## Принцип работы:
1. Скрипт запускает браузер хром с подсветкой layout shift.
2. Перед открытием страницы инжектится js код из `.src/core/collectors/scripts/window-performance.ts`. Он записывает все значения perfomanseobserver в window
3. Перед самим открытием начинается сниматся профайл со криншотами, в котором подсвечивается сдвиг контента
4. После анализа, создается отчет и сохранение в папку


## Анализ
![Пример отчета](https://raw.githubusercontent.com/pan-alexey/comultaive-layput-shift-metrics/images/screenshots.png)

Для детального анализа в отчете можно скачать сайм профайл `trace.json` и отчет по CLS

В отчете CLS.json попадают не все данные, а только те, которые имеют DOM узел (т.к. в процессе сбора, DOM узел может быть уделен).

В разделе layoutShift.widgets:

* html - html элемента который был сдвинут
* shift - на сколько был сдвинут (Если все значения нулевые, то виджет сначала отодвинулся, потом вернулся в начальное положение) 
* widget - виджет который был сдвинут ( элемент содержащий дата атрибут с названием) `./src/core/collectors/scripts/window-performance.ts` [7 строка]
## Частые ошибки:

```
TimeoutError: Navigation timeout of 30000 ms exceeded
    at /Users/pan-alexey/Documents/puppeteer-metrics/node_modules/puppeteer/lib/cjs/puppeteer/common/LifecycleWatcher.js:106:111 {
  name: 'TimeoutError'
}
```
Значит что страница не была полностью загруженна в течении 30 сек.