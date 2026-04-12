import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';

test('SauceDemo shopping flow with screencast narration', async ({ page }) => {
  // Configure viewport for better recording
  await page.setViewportSize({ width: 1280, height: 720 });

  // Start screencast recording
  await page.screencast.start({
    path: 'saucedemo-shopping-narrated.webm',
  });

  // Enable action annotations (shows all subsequent actions)
  await page.screencast.showActions({
    position: 'bottom-right',
  });

  // Optional: global overlay (e.g. title bar)
  await page.screencast.showOverlay(`
    <div style="
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      padding: 8px 16px;
      background: rgba(0,0,0,0.7);
      color: #fff;
      font-family: system-ui, sans-serif;
      font-size: 14px;
      z-index: 99999;
    ">
      Playwright 1.59 – Screencast narration demo (SauceDemo Shopping)
    </div>
  `);

  // Initialize page objects
  const loginPage = new LoginPage(page);

  // ============================================
  // Chapter 1 – Authentication
  // ============================================
  await page.screencast.showChapter('Logging in to SauceDemo');
  
  await page.goto('/');
  await expect(page).toHaveTitle(/Swag Labs/);

  await loginPage.login('standard_user', 'secret_sauce');

  await expect(page.locator('.title')).toContainText('Products');

  // ============================================
  // Chapter 2 – Browse Products
  // ============================================
  await page.screencast.showChapter('Browsing Products');

  const productCount = await page.locator('.inventory_item').count();

  // ============================================
  // Chapter 3 – Add Items to Cart
  // ============================================
  await page.screencast.showChapter('Adding Items to Cart');

  await page.locator('button:has-text("Add to cart")').first().click();
  await page.waitForTimeout(300);

  await page.locator('button:has-text("Add to cart")').nth(1).click();
  await page.waitForTimeout(300);

  const cartBadge = page.locator('.shopping_cart_badge');
  await expect(cartBadge).toHaveText('2');

  // ============================================
  // Chapter 4 – Review Cart
  // ============================================
  await page.screencast.showChapter('Reviewing Shopping Cart');

  await page.locator('.shopping_cart_link').click();
  await expect(page.locator('.title')).toContainText('Your Cart');

  const cartItems = await page.locator('.cart_item').count();
  await expect(cartItems).toBe(2);

  // ============================================
  // Chapter 5 – Checkout
  // ============================================
  await page.screencast.showChapter('Proceeding to Checkout');

  await page.locator('[data-test="checkout"]').click();
  await expect(page.locator('.title')).toContainText('Checkout');

  // ============================================
  // Chapter 6 – Enter Shipping Information
  // ============================================
  await page.screencast.showChapter('Entering Shipping Information');

  await page.locator('[data-test="firstName"]').fill('John');
  await page.locator('[data-test="lastName"]').fill('Doe');
  await page.locator('[data-test="postalCode"]').fill('12345');

  await page.locator('[data-test="continue"]').click();
  await expect(page.locator('.title')).toContainText('Checkout');

  // ============================================
  // Chapter 7 – Review Order
  // ============================================
  await page.screencast.showChapter('Reviewing Order Details');

  await expect(page.locator('[data-test="subtotal_label"]')).toBeVisible();
  await expect(page.locator('[data-test="tax_label"]')).toBeVisible();
  await expect(page.locator('[data-test="total_label"]')).toBeVisible();

  await page.locator('[data-test="finish"]').click();

  // ============================================
  // Chapter 8 – Order Confirmation
  // ============================================
  await page.screencast.showChapter('Order Confirmed');

  await expect(page.locator('.complete-header')).toContainText('Thank you for your order');
  await expect(page.locator('.complete-text')).toBeVisible();

  // ============================================
  // Final Chapter – Complete
  // ============================================
  await page.screencast.showChapter('Done');

  // Stop screencast and save file
  await page.screencast.stop();
});
