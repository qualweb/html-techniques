const {
  executeHTMLT
} = require('../dist/index');
const { getDom } = require('@qualweb/get-dom-puppeteer');
const { expect } = require('chai');
const fs = require('fs');

describe('HTML Techniques module', function() {

  const URL = 'http://accessible-serv.lasige.di.fc.ul.pt/~jvicente/test/';

  it('should execute all techniques', async function() {
    this.timeout(20 * 1000);
    const { source, processed } = await getDom(URL);
    const report = await executeHTMLT(URL, source.html.parsed, processed.html.parsed);
    const nTechniques = fs.readdirSync(__dirname + '/../src/techniques/').filter(f => f.startsWith('QW-HTML-T')).length;
    
    expect(Object.keys(report.techniques).length).to.be.equal(nTechniques);
  });
});
