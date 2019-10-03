const { expect } = require('chai');
const { executeHTMLT, configure } = require('../../dist/index');
const { getDom } = require('@qualweb/get-dom-puppeteer');

describe('Technique QW-HTML-T20', function() {
  it('should validate', async function() {
    this.timeout(20 * 10000);
    
    const dom = await getDom('https://ciencias.ulisboa.pt');

    configure({
      techniques: ['QW-HTML-T20']
    });

    const report = await executeHTMLT('https://ciencias.ulisboa.pt', dom.source.html.parsed, dom.processed.html.parsed);
    
    expect(report.techniques['QW-HTML-T20'].metadata.outcome).to.be.equal('failed');
  });
});
