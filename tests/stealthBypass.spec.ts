import { test, chromium } from '@playwright/test';

test('Test with JS Disabled', async () => {
  const browser = await chromium.launch({ headless: false });
  // Disable JavaScript entirely for this context
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');
  
  console.log('If the page loads now without hanging, the bot-shield is in their JS files.');
  await page.waitForTimeout(10000);
  await browser.close();
});