const puppeteer = require('puppeteer');
(async () => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('file:///C:/Users/PMLS/Desktop/esol/a2.html', { waitUntil: 'networkidle0' });
    await page.setViewport({width: 1200, height: 800});
    await page.screenshot({path: 'a2_screenshot.png'});
    
    // Check if header is larger than normal
    const headerHeight = await page.$eval('header', el => el.offsetHeight);
    const bodyHeight = await page.$eval('body', el => el.offsetHeight);
    console.log(`Header Height: ${headerHeight}px`);
    console.log(`Body Height: ${bodyHeight}px`);
    
    await browser.close();
})();
