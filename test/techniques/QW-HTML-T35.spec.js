const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');
const { BrowserUtils } =require('@qualweb/util');

describe('Technique QW-HTML-T35', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T35/test1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T35/test2.html',
      outcome: 'passed'
    }
  ];

  it('Starting testbench', async function () {
    let i = 0;
    const browser = await puppeteer.launch();
    let lastOutcome = 'warning';
    for (const test of tests || []) {
      if (test.outcome !== lastOutcome) {
        lastOutcome = test.outcome;
        i = 0;
      }
      i++;
      describe(`${test.outcome.charAt(0).toUpperCase() + test.outcome.slice(1)} example ${i}`, async function () {
        it(`should have outcome="${test.outcome}"`, async function () {
          this.timeout(25 * 1000);
          const {sourceHtml, page, stylesheets} = await getDom(browser, test.url);
          const url = page.url(); 
          const newTabWasOpen = await BrowserUtils.detectIfUnwantedTabWasOpened(browser, url);
          await page.addScriptTag({
            path: require.resolve('../html.js')
          });
          await page.addScriptTag({
            path: require.resolve('../qwPage.js')
          });
          sourceHtml.html.parsed = {};
          const report = await page.evaluate((newTabWasOpen) => {
            const html = new HTMLTechniques.HTMLTechniques();
            const report = html.execute(new QWPage.QWPage(document), newTabWasOpen, {});
            return report;
          },newTabWasOpen);
          expect(report.assertions['QW-HTML-T35'].metadata.outcome).to.be.equal(test.outcome);
        });
      });
    }
    describe(``,  function () {
      it(`pup shutdown`, async function () {
        await browser.close();
      });
    });
  });
});