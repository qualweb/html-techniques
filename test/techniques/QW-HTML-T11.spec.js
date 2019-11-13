const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T11', function() {

  const tests = [
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/passed1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/warning1.html',
      outcome: 'warning'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/failed1.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/failed2.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/failed3.html',
      outcome: 'failed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/h2/failed4.html',
      outcome: 'failed'
    }
  ];

  let i = 0;
  let lastOutcome = 'passed';
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
        expect(report.techniques['QW-HTML-T11'].metadata.outcome).to.be.equal(test.outcome);
        let qwId = 'QW-HTML-T11';
        let techniqueReport = report.techniques[qwId];
        if(!struct){
        struct = {'QW-HTML-T11':{
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
