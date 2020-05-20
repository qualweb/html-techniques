const { expect } = require('chai');
const { getDom } = require('../getDom');
const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');


describe('Technique QW-HTML-T3', function() {

  const tests = [
    /*{
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail2.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail3.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail4.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail5.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail6.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail7.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71fail8.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71warning.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71warning2.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71warning3.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H71/H71warning4.html',
      outcome: 'warning'
    },*/
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h71/fieldsetFormAttribute.html',
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
          expect(report.assertions['QW-HTML-T3'].metadata.outcome).to.be.equal(test.outcome);
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