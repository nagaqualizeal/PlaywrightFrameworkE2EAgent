import { test, chromium } from '@playwright/test';

test.describe('Chrome Browser Navigation', () => {
  test('Navigate to example.com and check page title', async () => {
    const browser = await chromium.launch({
      channel: 'chrome',   // use installed Chrome
      headless: false      // show the browser
    });

    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');

    const pageTitle = await page.title();
    console.log('Page title:', pageTitle);
await page.waitForTimeout(10000); // waits for 10 seconds

    await browser.close();
  });

//   test('Navigate to multiple sites', async () => {
//     const browser = await chromium.launch({
//       channel: 'chrome',
//       headless: false
//     });

//     const context = await browser.newContext();
//     const page = await context.newPage();

//     // Navigate to first site
//     await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');
//     console.log('Site 1 title:', await page.title());

//     // Navigate to second site
//     await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');
//     console.log('Site 2 title:', await page.title());

//     // Navigate to third site
//     await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');
//     console.log('Site 3 title:', await page.title());

//     await browser.close();
//   });
});
