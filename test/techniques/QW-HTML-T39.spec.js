
const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T39', function () {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T39/test1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T39/test2.html',
      outcome: 'inapplicable'
    }, {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T39/test3.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/TesteHTML-T39/test4.html',
      outcome: 'failed'
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

        configure({
          techniques: ['QW-HTML-T39']
        });

        const report = await executeHTMLT(test.url, source.html.parsed, processed.html.parsed);
        expect(report.techniques['QW-HTML-T39'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }

});