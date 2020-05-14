const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');
endpoint = 'http://194.117.20.242/validate/';

describe('Technique QW-HTML-T20', function () {

  it('Decorator', async function () {
    this.timeout(100 * 1000);
    const browser = await puppeteer.launch();
    // const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222/', defaultViewport: null });
    const { sourceHtml, page, stylesheets } = await getDom(browser, 'https://www.ama.gov.pt/');
    const url = await page.evaluate(() => {
      return location.href;
    });

    const validationUrl = endpoint + encodeURIComponent(url);

    let response, validation;

    try {
      response = await fetch(validationUrl);
    } catch (err) {
      console.log(err);
    }
    await page.addScriptTag({
      path: require.resolve('../html.js')
    });
    await page.addScriptTag({
      path: require.resolve('../qwPage.js')
    });
    if (response && response.status === 200)
      validation = JSON.parse(await response.json());
    sourceHtml.html.parsed = {};
    const report = await page.evaluate((validation) => {
      const html = new HTMLTechniques.HTMLTechniques();
      const report = html.execute(new QWPage.QWPage(document), false, validation);
      return report;
    }, validation);
    console.log(report.assertions['QW-HTML-T20'].metadata);
    expect(report.assertions['QW-HTML-T20'].metadata.outcome).to.be.equal('passed');

    describe(``, function () {
      it(`pup shutdown`, async function () {
        // await browser.close();
      });
    });
  });
});
