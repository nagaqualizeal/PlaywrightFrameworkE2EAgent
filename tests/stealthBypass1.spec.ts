const { chromium } = require('playwright');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { addExtra } = require('playwright-extra');

async function activateASTM() {
  // Add stealth plugin
  const playwright = addExtra(chromium);
  playwright.use(StealthPlugin());

  const browser = await playwright.launch({
    headless: false, // Run in headful mode for debugging
    args: [
      '--disable-blink-features=AutomationControlled',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-infobars',
      '--disable-web-security',
      '--disable-features=IsolateOrigins,site-per-process',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu',
      '--window-size=1920,1080',
    ],
  });

  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    viewport: { width: 1920, height: 1080 },
    bypassCSP: true,
    javaScriptEnabled: true,
    ignoreHTTPSErrors: true,
  });

  // Override WebDriver and plugins
  await context.addInitScript(() => {
    Object.defineProperty(navigator, 'webdriver', { get: () => false });
    Object.defineProperty(navigator, 'plugins', { get: () => [1, 2, 3, 4, 5] });
    Object.defineProperty(navigator, 'languages', { get: () => ['en-US', 'en'] });
  });

  const page = await context.newPage();

  // Block known bot detection scripts
  await page.route('**/*', (route) => {
    const url = route.request().url();
    if (
      url.includes('botd') ||
      url.includes('arkoselabs') ||
      url.includes('perimeterx') ||
      url.includes('cloudflare')
    ) {
      console.log('Blocked bot detection script:', url);
      route.abort();
    } else {
      route.continue();
    }
  });

  // Navigate to the activation URL
  console.log('Navigating to ASTM activation page...');
  await page.goto(
    'https://stage-secure.astm.org/activate/activation?activationtoken=beeBaN_Jus6S75sXv_rG&redirectUrl=https://stage-compass.astm.org/',
    { waitUntil: 'networkidle2', timeout: 60000 }
  );

  // Simulate human-like mouse movements
  await page.mouse.move(100, 100);
  await page.mouse.down();
  await page.mouse.move(200, 200);
  await page.mouse.up();
  await page.waitForTimeout(2000);

  // Wait for page to load or detect challenges
  console.log('Waiting for page to load...');
  await page.waitForTimeout(10000);

  // Take a screenshot for debugging
  await page.screenshot({ path: 'astm_activation.png' });
  console.log('Screenshot saved as astm_activation.png');

  // Close the browser
  await browser.close();
}

// Run the script
activateASTM().catch(console.error);