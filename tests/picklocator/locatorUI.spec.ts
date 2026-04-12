import { test } from '@playwright/test';
import { startLocatorGeneratorUI } from '../../utils/locatorGeneratorUI';

test('UI Locator Tool Demo', async ({ page }) => {

  test.setTimeout(0); // 🔥 VERY IMPORTANT

  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // await page.click('.shopping_cart_link');

  // 🚀 Start UI tool
  await startLocatorGeneratorUI(page);

});