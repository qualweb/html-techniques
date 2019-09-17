const {
  configure,
  executeHTMLT
} = require('../../dist/index');
const { expect } = require('chai');
const stew = new (require('stew-select')).Stew();
const {
  getDom
} = require('@qualweb/get-dom-puppeteer');


describe('Technique QW-HTML-T50', function() {

  const tests = [
    /*{
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeAN/test1.html',
      outcome: 'passed'
    },
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/testeAN/test2.html',
      outcome: 'failed'
    },*/
    {
      url: 'http://accessible-serv.lasige.di.fc.ul.pt/~aestriga/',
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

        const options = {
          mobile: false, // default false
          landscape: true, // default false
          userAgent: 'your custom user agent',
          resolution: {
            width: 1920, // default 1920
            height: 1080 // default 1080
          },
          computedStyle: true, // default true - adds the computed style to each element in a custom attribute [computed-style]
          elementsPosition: false // default true - adds the element position in relation to the viewport and scroll, attributes [w-scrollx, w-scrolly, b-right, b-bottom]
        };
    
        const { source, processed } = await getDom(test.url);
        let p = stew.select_first(processed.html.parsed, 'p');

        console.log(p);


        const report = await executeHTMLT(source.html.parsed, processed.html.parsed);
        //expect(report.techniques['QW-HTML-T50'].metadata.outcome).to.be.equal(test.outcome);
      });
    });
  }
  
});