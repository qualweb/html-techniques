const {
  HTMLTechniques
} = require('../../dist/index');
const puppeteer = require('puppeteer');
const { getDom } = require('../getDom');
const { expect } = require('chai');
/*const {
  getDom
} = require('@qualweb/get-dom-puppeteer');*/


describe('Technique QW-HTML-T23', function() {

  it.only('Decorator', async function() {
    this.timeout(100 * 1000);
    const browser = await puppeteer.launch();
    const { page } = await getDom(browser, 'https://www.ama.gov.pt/');
    const html = new HTMLTechniques();
    //html.configure({ techniques: ['QW-HTML-T8']});
    const report = await html.execute(page);
    console.log(report)
    await browser.close();
  });

  /*const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g125/warning.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g125/inapplicable.html',
      outcome: 'inapplicable'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g125/inapplicable2.html',
      outcome: 'inapplicable'
    }
  ];

  let i = 0;
  let lastOutcome = 'warning';
  for (const test of tests || []) {
    if (test.outcome !== lastOutcome) {
      lastOutcome = test.outcome;
      i = 0;
    }
    i++;
    describe(`${test.outcome.charAt(0).toUpperCase() + test.outcome.slice(1)} example ${i}`, function () {
      it(`should have outcome="${test.outcome}"`, async function () {
        this.timeout(20 * 1000);
        const { source, processed } = await getDom(test.url);


        const report = await executeHTMLT(test.url, source.html.parsed, processed.html.parsed);
        expect(report.assertions['QW-HTML-T23'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }*/

});
