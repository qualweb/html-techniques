const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');

describe('Technique QW-HTML-T38', async function () {

  const tests = [
    /* {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/emptyBody.html',
        outcome: 'inapplicable'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/testeEstriga/testeEstriga3.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/notLink.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/notLocalContent.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/inexistentElement.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/emptyHref.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/wrongAbsolutePath.html',
        outcome: 'failed'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withoutMain.html',
        outcome: 'warning'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withMain.html',
        outcome: 'warning'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withFarAwayMain.html',
        outcome: 'warning'
      },
      {
        url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/absolutePath.html',
        outcome: 'warning'
      },*/
    {
      url: 'http://www.di.fc.ul.pt/~cad/SONAAR/',
      outcome: 'warning'
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
          expect(report.assertions['QW-HTML-T38'].metadata.outcome).to.be.equal(test.outcome);
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