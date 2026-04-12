import { chromium } from 'playwright';
import { startLocatorGeneratorUI } from '../utils/locatorGeneratorUI';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 🔐 Setup
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  await page.click('.shopping_cart_link');

  // 🚀 Start UI Tool
  await startLocatorGeneratorUI(page);

})();