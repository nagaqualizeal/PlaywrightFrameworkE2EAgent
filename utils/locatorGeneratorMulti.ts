import { Page, Locator } from '@playwright/test';

function isPageAlive(page: Page): boolean {
  try {
    return !page.isClosed();
  } catch {
    return false;
  }
}

// 🔹 Highlight element
async function highlight(locator: Locator) {
  try {
    await locator.evaluate((el: HTMLElement) => {
      el.style.outline = '3px solid red';
      el.setAttribute('data-highlighted', 'true');
    });
  } catch {}
}

// 🔹 Remove highlight
async function removeHighlight(page: Page) {
  try {
    await page.evaluate(() => {
      document.querySelectorAll('[data-highlighted="true"]').forEach(el => {
        (el as HTMLElement).style.outline = '';
        el.removeAttribute('data-highlighted');
      });
    });
  } catch {}
}

// 🔹 Overlay
async function showOverlay(page: Page, text: string) {
  try {
    await page.evaluate((msg) => {
      let overlay = document.getElementById('pw-overlay');

      if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'pw-overlay';
        overlay.style.position = 'fixed';
        overlay.style.top = '20px';
        overlay.style.right = '20px';
        overlay.style.padding = '10px 14px';
        overlay.style.background = 'black';
        overlay.style.color = 'white';
        overlay.style.borderRadius = '6px';
        overlay.style.fontSize = '14px';
        overlay.style.zIndex = '9999';
        document.body.appendChild(overlay);
      }

      overlay.innerText = msg;
    }, text);
  } catch {}
}

// 🔹 Remove overlay
async function removeOverlay(page: Page) {
  try {
    await page.evaluate(() => {
      const overlay = document.getElementById('pw-overlay');
      if (overlay) overlay.remove();
    });
  } catch {}
}

// 🔹 Smart action (demo-friendly)
async function performAction(locator: Locator) {
  try {
    const tag = await locator.evaluate(el => el.tagName.toLowerCase());
    const type = await locator.evaluate(el => (el as HTMLInputElement).type);

    if (tag === 'input') {
      console.log('⌨️ Filling input...');
      await locator.fill('Demo123');
      return;
    }

    if (tag === 'textarea') {
      console.log('⌨️ Filling textarea...');
      await locator.fill('Demo text');
      return;
    }

    if (tag === 'select') {
      console.log('📋 Selecting dropdown...');
      await locator.selectOption({ index: 1 });
      return;
    }

    if (tag === 'input' && type === 'checkbox') {
      console.log('☑️ Checking checkbox...');
      await locator.check();
      return;
    }

    console.log('🖱️ Clicking element...');
    await locator.click();

  } catch {
    console.log('⚠️ Action skipped');
  }
}

export async function startLocatorGenerator(page: Page) {
  const locators: { page: string; locator: string }[] = [];

  let lastLocator: string | null = null;
  let step = 1;

  console.log('\n🚀 Smart Locator Generator (Infinite Mode)');
  console.log('👉 First click = capture');
  console.log('👉 Second click = perform action');
  console.log('👉 Close browser anytime to stop\n');

  while (true) {
    try {
      if (!isPageAlive(page)) break;

      const currentUrl = page.url();

      console.log(`\n🌐 Page: ${currentUrl}`);
      console.log(`👉 Click element (${step})`);

      const picked = await page.pickLocator();
      const normalized = await picked.normalize();

      const locatorString = normalized.toString();

      // 🔁 SECOND CLICK → perform action
      if (lastLocator === locatorString) {
        console.log('🚀 Second click detected → performing action');

        await removeOverlay(page);
        await removeHighlight(page);

        await performAction(normalized);
        await page.waitForLoadState('domcontentloaded').catch(() => {});

        lastLocator = null;
        continue;
      }

      // 🟢 FIRST CLICK → capture
      console.log(`✅ Captured: ${locatorString}`);

      const exists = locators.some(
        l => l.locator === locatorString && l.page === currentUrl
      );

      if (!exists) {
        locators.push({
          page: currentUrl,
          locator: locatorString
        });
      }

      await highlight(normalized);
      await showOverlay(page, 'Click same element again to perform action');

      lastLocator = locatorString;
      step++;

    } catch (e) {
      console.log('\n🛑 Stopped (browser closed or user exit)');
      break;
    }
  }

  // cleanup safely
  await removeOverlay(page);
  await removeHighlight(page);

  // 🎯 OUTPUT
  const grouped = locators.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item.locator);
    return acc;
  }, {} as Record<string, string[]>);

  console.log('\n📦 ===== GENERATED PAGE OBJECTS =====\n');

  Object.entries(grouped).forEach(([url, locs], index) => {
    console.log(`// 🌐 Page: ${url}`);
    console.log(`export class Page${index + 1} {`);
    console.log(`  constructor(private page) {}\n`);

    locs.forEach((loc, i) => {
      console.log(`  element${i + 1} = () => this.page.${loc};`);
    });

    console.log(`}\n`);
  });
}