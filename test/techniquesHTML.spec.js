const { expect } = require('chai');
const puppeteer = require('puppeteer');
const { getDom } = require('./getDom');
const { HTMLTechniques } = require('../dist/index');

describe('HTML module', function () {
  it('Should evaluate www.nav.no', async function () {
    this.timeout(1000 * 1000);
    const browser = await puppeteer.launch();
    const { sourceHtml, page, stylesheets } = await getDom(browser, 'https://www.pcdiga.com/');

    try {
      await page.addScriptTag({
        path: require.resolve('../dist/html.js')
      })
      await page.addScriptTag({
        path: require.resolve('./qwPage.js')
      })
      const report = await page.evaluate(() => {
        const html = new HTMLTechniques.HTMLTechniques();
        const report = html.execute( new QWPage.QWPage(document),false, {});
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