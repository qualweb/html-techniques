const { expect } = require('chai');
const playwright = require('playwright');
const { getDom } = require('./getDom');
const { HTMLTechniques } = require('../dist/index');

describe('HTML module', function () {
  it('Should evaluate www.nav.no', async function () {
    this.timeout(1000 * 1000);
    const browser = await playwright['webkit'].launch({headless:false});
    const context = await browser.newContext();
    const { sourceHtml, page, stylesheets } = await getDom(browser, 'https://www.accessibility.nl/wai-tools/validation-test-sites/wikipedia-wikipedia/');

    try {
      await page.addScriptTag({
        path: require.resolve('../dist/html.js')
      })
      await page.addScriptTag({
        path: require.resolve('@qualweb/qw-page').replace('index.js', 'qwPage.js')
      })
      const report = await page.evaluate(() => {
        const html = new HTMLTechniques.HTMLTechniques();
        const report = html.execute( new QWPage.QWPage(document,window),false, {});
        return report;
      });
      const fs = require('fs')
      // Write data in 'Output.txt' . 
      fs.writeFile('Output.txt', JSON.stringify(report, null, 2), (err) => {
        // In case of a error throw err. 
        if (err) throw err;
      })
    } catch (err) {
      console.error(err);
    } finally {
      await browser.close();
    }
  })
});