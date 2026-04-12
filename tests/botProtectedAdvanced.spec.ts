import { test, expect, chromium } from '@playwright/test';

test.describe('Bot Protected Page Tests', () => {
  
  test('bot-protected page with custom context', async () => {
    // 1. Launch browser
    const browser = await chromium.launch({
      headless: false, // set true in CI if you like
    });

    // 2. Create context and inject script BEFORE any page loads
    const context = await browser.newContext();

    await context.addInitScript(() => {
      // This runs in the browser context before any other scripts
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });
    });

    // 3. Create a page from this context
    const page = await context.newPage();

    // 4. Navigate to your bot-protected URL
    await page.goto('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/', {
      waitUntil: 'networkidle',
    });
  
    // 5. Add assertions that make sense for your page
    await expect(page).toHaveTitle(/Some Expected Title/i);

    // 6. Cleanup
    await browser.close();
  });

  
});
