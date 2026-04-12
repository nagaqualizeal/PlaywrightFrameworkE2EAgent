import { chromium } from 'playwright';
import { startLocatorGeneratorSmart } from '../utils/locatorGeneratorToggle1'; // 👈 your new file

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 🔐 Login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // 🛒 Go to cart
  await page.click('.shopping_cart_link');

  // 🚀 Start Smart Locator Tool
  await startLocatorGeneratorSmart(page);

  // 🛑 Close safely (only after loop ends)
  if (!page.isClosed()) {
    await browser.close();
  }
})();