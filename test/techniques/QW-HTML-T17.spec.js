const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const {expect} = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


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
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/failed1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/duplicateIds.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h43/onlyId.html',
      outcome: 'failed'
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
        this.timeout(20 * 1000);
        const {source, processed} = await getDom(test.url);


        const report = await executeHTMLT(test.url, source.html.parsed, processed.html.parsed);
        expect(report.techniques['QW-HTML-T17'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }

});
