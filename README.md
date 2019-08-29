# QualWeb HTML techniques

## How to install

```shell
  $ npm i @qualweb/html-techniques --save
```

## How to run

### Additional packages

```shell
  $ npm i @qualweb/get-dom-puppeteer --save
```

```javascript
  'use strict';

  const { getDom } = require('@qualweb/get-dom-puppeteer');
  const { executeHTMLT } = require('@qualweb/html-techniques');

  (async () => {
    const { source, processed } = await getDom('https://act-rules.github.io/pages/about/');

    const report = await executeHTMLT(source.html.parsed, processed.html.parsed);

    console.log(report);
  })();
```

# License

ISC