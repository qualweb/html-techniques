const {
  HTMLTechniques
} = require('../../dist/index');
const { expect } = require('chai');
const { getDom } = require('../getDom');
const puppeteer = require('puppeteer');




describe('Technique QW-HTML-T8', async function () {

  const tests = [
    {
      url: 'https://www.pcdiga.com/',
      outcome: 'failed'
    }/*,
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/failed2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/failed3.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/failed4.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/failed5.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/failed6.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/warning1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/f30/inapplicable.html',
      outcome: 'inapplicable'
    }*/
  ];
  it('Starting testbench', async function () {
    const browser = await puppeteer.launch();



    let i = 0;
    let lastOutcome = 'failed';
    for (const test of tests || []) {
      if (test.outcome !== lastOutcome) {
        lastOutcome = test.outcome;
        i = 0;
      }
      i++;
      describe(`${test.outcome.charAt(0).toUpperCase() + test.outcome.slice(1)} example ${i}`, function () {
        it(`should have outcome="${test.outcome}"`, async function () {
          this.timeout(200 * 1000);
          const { page } = await getDom(browser, test.url);
          const htmlTecniques = new HTMLTechniques();

          const report = await htmlTecniques.execute(page);
          console.log(report);
          //expect(report.assertions['QW-HTML-T8'].metadata.outcome).to.be.equal(test.outcome);
        });
      });
      describe(`Closing testbench`, async function () {
        it(`Closed`, async function () {
          //await browser.close();
        });
      });
    }
  });
});
