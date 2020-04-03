const { HTMLTechniques } = require('../../dist/index');
const puppeteer = require('puppeteer');
const { getDom } = require('../getDom');
const { expect } = require('chai');



describe('Technique QW-HTML-T20', function() {

  it.only('Decorator', async function() {
    this.timeout(100 * 1000);
    const browser = await puppeteer.launch();
    const { page } = await getDom(browser, 'https://www.ama.gov.pt/');
    const html = new HTMLTechniques({ techniques: ['QW-HTML-T20']});
    
    const report = await html.execute(page);
    console.log(report);
    await browser.close();
    expect(true);
  });
});
