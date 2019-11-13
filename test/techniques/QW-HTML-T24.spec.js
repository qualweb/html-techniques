const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


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

  let i = 0;
  let lastOutcome = 'failed';
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
        expect(report.techniques['QW-HTML-T24'].metadata.outcome).to.be.equal(test.outcome);
        let qwId = 'QW-HTML-T24';
        let techniqueReport = report.techniques[qwId];
        if(!struct){
        struct = {'QW-HTML-T24':{
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
