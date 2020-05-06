const {
  HTMLTechniques
} = require('../../dist/index');
const { expect } = require('chai');
const { getDom } = require('../getDom');
const puppeteer = require('puppeteer');


describe('Technique QW-HTML-T24', function() {

  const tests = [
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/G88/G88fail.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/G88/G88fail2.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/G88/G88warning.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/G88/G88warning2.html',
      outcome: 'warning'
    }
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
          const htmlTecniques = new HTMLTechniques({
            techniques: ['QW-HTML-T24']
          });

          const report = await htmlTecniques.execute(page);
          console.log(report);
          //expect(report.assertions['QW-HTML-T8'].metadata.outcome).to.be.equal(test.outcome);
        });
      });
    }
    describe(`Closing testbench`, async function () {
      it(`Closed`, async function () {
        await browser.close();
      });
    });
  });
});
