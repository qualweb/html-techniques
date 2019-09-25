const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T00', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/failedSummary1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/failedTabIndex1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/failedInput1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/passedSummary1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/passedTabIndex1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/passedTabIndex2.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/passedTabIndex3.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/focusable/passedInput1.html',
      outcome: 'passed'
    }
  ];

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
        this.timeout(10 * 1000);
        const { source, processed } = await getDom(test.url);


        const report = await executeHTMLT(source.html.parsed, processed.html.parsed);
        expect(report.techniques['QW-HTML-T00'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }

});
