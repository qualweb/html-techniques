const {
  HTMLTechniques
} = require('../../dist/index');
const { expect } = require('chai');
const { getDom } = require('../getDom');
const puppeteer = require('puppeteer');

describe('Technique QW-HTML-T33', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T33/test1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T33/test2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T33/test3.html',
      outcome: 'failed'
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
            techniques: ['QW-HTML-T13']
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

