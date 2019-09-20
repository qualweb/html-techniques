
const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const stew = new (require('stew-select')).Stew();
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T1', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeG141/test1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeG141/test2.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeG141/test3.html',
      outcome: 'passed'
    },{
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeG141/test5.html',
      outcome: 'passed'
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
       

        const report = await executeHTMLT(source.html.parsed, processed.html.parsed);
        expect(report.techniques['QW-HTML-T1'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }
  
});