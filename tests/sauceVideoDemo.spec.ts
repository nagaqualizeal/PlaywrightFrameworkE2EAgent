import { test, expect } from '@playwright/test';

test('Screencast full demo - SauceDemo login flow', async ({ page }) => {
  
  // Navigate to app
  await page.goto('https://www.saucedemo.com/');

  // 🎥 Start screencast
  await page.screencast.start({
    path: 'screencast-login-demo.webm'
  });

  // 🖱️ Show actions at bottom-right (as requested)
  await page.screencast.showActions({
    position: 'top-right'
  });

  // 📖 Chapter 1 - Login
  await page.screencast.showChapter('Login Step', {
    description: 'Entering valid credentials and logging in'
  });

 

  await page.locator('#user-name').fill('standard_user');
  await page.locator('#password').fill('secret_sauce');
  await page.locator('#login-button').click();

  
  // 📖 Chapter 2 - Verification
  await page.screencast.showChapter('Verification Step', {
    description: 'Validating successful navigation to inventory page'
  });

  await expect(page).toHaveURL(/inventory/);

  // 📖 Chapter 3 - Interaction
  await page.screencast.showChapter('Add Product to Cart', {
    description: 'Adding first product to cart'
  });

  await page.locator('.inventory_item button').first().click();

  // 📖 Chapter 4 - Final State
  await page.screencast.showChapter('Final Validation', {
    description: 'Checking cart badge update'
  });

  await expect(page.locator('.shopping_cart_badge')).toHaveText('1');

  // 🎥 Stop screencast
  await page.screencast.stop();
});