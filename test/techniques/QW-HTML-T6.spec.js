const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T6', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/QW6/QW6_1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/QW6/QW6_2.html',
      outcome: 'failed'
    }
  ];

  let i = 0;
  let lastOutcome = 'passed';
  for (const test of tests || []) {
    if (test.outcome !== lastOutcome) {
      lastOutcome = test.outcome;
      i = 0;
    }
    i++;
    describe(`${test.outcome.charAt(0).toUpperCase() + test.outcome.slice(1)} example ${i}`, function () {
      it(`should have outcome="${test.outcome}"`, async function () {
        this.timeout(10 * 1000);
        const { source, processed } = await getDom(test.url);
        configure({
          rules: ['QW-HTML-T1']
        });
        const report = await executeHTMLT(source.html.parsed, processed.html.parsed);
        console.log(report);
        console.log(Object.keys(report));
        expect(report.techniques['QW-HTML-T1'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }
  
});
