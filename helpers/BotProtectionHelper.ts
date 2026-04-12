import { chromium, Browser, BrowserContext, Page } from '@playwright/test';

/**
 * Helper class to handle bot-protected pages by bypassing webdriver detection
 * Injects custom scripts to mask automated browser indicators
 */
export class BotProtectionHelper {
  private browser: Browser | null = null;
  private context: BrowserContext | null = null;
  private page: Page | null = null;

  /**
   * Initialize browser with bot protection bypass
   * @param headless - Run browser in headless mode (default: false)
   * @returns Promise<void>
   */
  async initBrowserWithBotProtection(headless: boolean = false): Promise<void> {
    // 1. Launch browser
    this.browser = await chromium.launch({
      headless: headless,
    });

    // 2. Create context
    this.context = await this.browser.newContext();

    // 3. Inject script before any page loads
    await this.context.addInitScript(() => {
      // Hide webdriver property
      Object.defineProperty(navigator, 'webdriver', {
        get: () => undefined,
      });

      // Optional: Additional bot detection bypasses
      Object.defineProperty(navigator, 'chromeSupport', {
        get: () => undefined,
      });
      Object.defineProperty(navigator, 'plugins', {
        get: () => [],
      });
    });
  }

  /**
   * Navigate to a URL
   * @param url - URL to navigate to
   * @param waitUntil - Wait condition (default: 'networkidle')
   * @returns Promise<void>
   */
  async navigateTo(
    url: string,
    waitUntil: 'load' | 'domcontentloaded' | 'networkidle' = 'networkidle'
  ): Promise<void> {
    if (!this.context) {
      throw new Error('Browser context not initialized. Call initBrowserWithBotProtection first.');
    }

    this.page = await this.context.newPage();
    await this.page.goto(url, {
      waitUntil: waitUntil,
    });
  }

  /**
   * Get the current page instance
   * @returns Page instance
   */
  getPage(): Page {
    if (!this.page) {
      throw new Error('Page not initialized. Call navigateTo first.');
    }
    return this.page;
  }

  /**
   * Get the browser context
   * @returns BrowserContext instance
   */
  getContext(): BrowserContext {
    if (!this.context) {
      throw new Error('Context not initialized. Call initBrowserWithBotProtection first.');
    }
    return this.context;
  }

  /**
   * Get the browser instance
   * @returns Browser instance
   */
  getBrowser(): Browser {
    if (!this.browser) {
      throw new Error('Browser not initialized. Call initBrowserWithBotProtection first.');
    }
    return this.browser;
  }

  /**
   * Cleanup and close browser
   * @returns Promise<void>
   */
  async cleanup(): Promise<void> {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
      this.context = null;
      this.page = null;
    }
  }
}
