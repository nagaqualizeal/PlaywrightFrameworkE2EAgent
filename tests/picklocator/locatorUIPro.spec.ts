import { test } from '@playwright/test';
import { startLocatorGeneratorUIPro } from '../../utils/locatorGeneratorUIPro';

test('UI Locator Generator (Pro Mode)', async ({ page }) => {

  // 🔥 VERY IMPORTANT → prevent timeout
  test.setTimeout(0);

  // 🔐 Login
  await page.goto('https://www.saucedemo.com/');
  await page.fill('[data-test="username"]', 'standard_user');
  await page.fill('[data-test="password"]', 'secret_sauce');
  await page.click('[data-test="login-button"]');

  // 🛒 Go to cart
  await page.click('.shopping_cart_link');

  // 🚀 Start UI Tool
  await startLocatorGeneratorUIPro(page);

});