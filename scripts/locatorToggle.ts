import { chromium } from 'playwright';
import { startLocatorGeneratorToggle } from '../utils/locatorGeneratorToggle';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  // 👉 Do your setup here (login etc.)
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  await page.click('.shopping_cart_link');

  // 🚀 Start interactive tool
  await startLocatorGeneratorToggle(page);

  await browser.close();
})();