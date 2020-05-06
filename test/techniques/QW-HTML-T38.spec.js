



const {
  HTMLTechniques
} = require('../../dist/index');
const { expect } = require('chai');
const { getDom } = require('../getDom');
const puppeteer = require('puppeteer');

describe('Technique QW-HTML-T38', async function () {


  it('Starting testbench', async function () {


    const tests = [
      /* {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/emptyBody.html',
         outcome: 'inapplicable'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/testeEstriga/testeEstriga3.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/notLink.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/notLocalContent.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/inexistentElement.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/emptyHref.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/wrongAbsolutePath.html',
         outcome: 'failed'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withoutMain.html',
         outcome: 'warning'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withMain.html',
         outcome: 'warning'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/withFarAwayMain.html',
         outcome: 'warning'
       },
       {
         url: 'http://accessible-serv.lasige.di.fc.ul.pt/~bandrade/g1/absolutePath.html',
         outcome: 'warning'
       },*/
      {
        url: 'http://www.di.fc.ul.pt/~cad/SONAAR/',
        outcome: 'warning'
      }
    ];
    const browser = await puppeteer.launch();

    let i = 0;

    describe(`Testing`, function () {
      for (const test of tests || []) {
        it(`should have outcome="${test.outcome}"`, async function () {
          let lastOutcome = 'failed';

          if (test.outcome !== lastOutcome) {
            lastOutcome = test.outcome;
            i = 0;
          }
          i++;
          this.timeout(200 * 1000);
          const { page } = await getDom(browser, test.url);
          const htmlTecniques = new HTMLTechniques({
            techniques: ['QW-HTML-T38']
          });

          const report = await htmlTecniques.execute(page);
          console.log(report.techniques['QW-HTML-T38'].results);
          //expect(report.assertions['QW-HTML-T8'].metadata.outcome).to.be.equal(test.outcome);
        }
        );
      }
    });

    describe(`Closing testbench`, async function () {
      it(`Closed`, async function () {
        await browser.close();
      });
    });
  });
});

