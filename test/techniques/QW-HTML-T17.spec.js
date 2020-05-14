const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');


describe('Technique QW-HTML-T17', function () {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/passed1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/passed2.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/emptyHeaders.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/failed1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/duplicateIds.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/onlyId.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/tabelaData.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/tabelaData2.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/tabelaLayout.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/tabelaLayout2.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/noIdOrHeader.html',
      outcome: 'inapplicable'
    },
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
          expect(report.assertions['QW-HTML-T17'].metadata.outcome).to.be.equal(test.outcome);
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