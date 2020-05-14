const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');

describe('Technique QW-HTML-T20', function() {

  it('Decorator', async function() {
    this.timeout(100 * 1000);
    const browser = await puppeteer.launch();
    const {sourceHtml, page, stylesheets} = await getDom(browser, 'https://www.ama.gov.pt/');
    await page.addScriptTag({
      path: require.resolve('../html.js')
    });
    await page.addScriptTag({
      path: require.resolve('../qwPage.js')
    });
    sourceHtml.html.parsed = {};
    const report = await page.evaluate(() => {
      const html = new HTMLTechniques.HTMLTechniques();
      const report = html.execute(new QWPage.QWPage(document), false, {});
      return report;
    });
    expect(report.assertions['QW-HTML-T20'].metadata.outcome).to.be.equal('passed');
    
    describe(``,  function () {
      it(`pup shutdown`, async function () {
        await browser.close();
      });
    });
  });
});
