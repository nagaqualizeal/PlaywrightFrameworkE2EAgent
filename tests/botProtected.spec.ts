import { test, expect } from '@playwright/test';
import { BotProtectionHelper } from '../helpers/BotProtectionHelper';

export class BotProtectionTest {
  private botHelper: BotProtectionHelper;

  constructor() {
    this.botHelper = new BotProtectionHelper();
  }

  async testPageContentVisibility(): Promise<void> {
    try {
      await this.botHelper.initBrowserWithBotProtection(false);
      await this.botHelper.navigateTo('https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/');

      const page = this.botHelper.getPage();
      const loginButton = await page.locator('input[type="submit"]');
      await expect(loginButton).toBeVisible();

      console.log('✓ Page content is visible and accessible');
    } finally {
      await this.botHelper.cleanup();
    }
  }
}

test.describe('Bot Protection Tests', () => {
  let botTest: BotProtectionTest;

  test.beforeEach(() => {
    botTest = new BotProtectionTest();
  });

  test('should verify page content is visible', async () => {
    await botTest.testPageContentVisibility();
  });
});
