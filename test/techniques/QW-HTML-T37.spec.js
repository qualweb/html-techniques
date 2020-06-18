const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');

describe('Technique QW-HTML-T37', function () {

  const tests = [
    {
      url: "https://www.ama.gov.pt/",//"https://www.w3.org/TR/UNDERSTANDING-WCAG20/understanding-techniques.html",
      outcome: 'passed'
    }
    /**{
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedSummary1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedTabIndex1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedInput1.html',
      outcome: 'failed'
    },*/
    /**
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failed1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedHidden1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedHidden2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedParent1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedParent2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedParent3.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedCSS1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedCSS2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/failedCSS3.html',
      outcome: 'failed'
    },*/
    /**{
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedSummary1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedTabIndex1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedTabIndex2.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedTabIndex3.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedInput1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passed1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/passedHidden1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g123/warningParent1.html',
      outcome: 'warning'
    }*/
  ];

  it('Starting testbench', async function () {
    let i = 0;
    const browser = await puppeteer.connect({ browserURL: 'http://127.0.0.1:9222/', defaultViewport: null });

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
          const { sourceHtml, page, stylesheets } = await getDom(browser, test.url);
          await page.addScriptTag({
            path: require.resolve('../../dist/html.js')
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
          console.log(report.assertions['QW-HTML-T37'])
          expect(report.assertions['QW-HTML-T37'].metadata.outcome).to.be.equal(test.outcome);
        });
      });
    }
    describe(``, function () {
      it(`pup shutdown`, async function () {
       // await browser.close();
      });
    });
  });
});