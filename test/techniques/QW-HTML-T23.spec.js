const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T23', function() {

  const tests = [
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
  let struct = undefined;
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
        expect(report.techniques['QW-HTML-T23'].metadata.outcome).to.be.equal(test.outcome);
        let qwId = 'QW-HTML-T23';
        let techniqueReport = report.techniques[qwId];
        if(!struct){
        struct = {'QW-HTML-T23':{
           name :techniqueReport.name,
           description :techniqueReport.description}};}

        for(let child of techniqueReport.results){
          struct[qwId][child.resultCode] = child.description; 
        }
        console.log(struct);
      });
    });
  }

});
