const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T4', function() {

  const tests = [
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail2.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail3.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail4.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail5.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73fail6.html',
      outcome: 'failed'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73warning.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73warning2.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73warning3.html',
      outcome: 'warning'
    },
    {
      url: 'https://accessible-serv.lasige.di.fc.ul.pt/~fcaeiro/H73/H73warning4.html',
      outcome: 'warning'
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
        this.timeout(20 * 1000);
        const { source, processed } = await getDom(test.url);


        const report = await executeHTMLT(test.url, source.html.parsed, processed.html.parsed);
        expect(report.techniques['QW-HTML-T4'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }

});
