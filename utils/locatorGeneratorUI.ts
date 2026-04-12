import { Page } from 'playwright';

function isPageAlive(page: Page): boolean {
  try {
    return !page.isClosed();
  } catch {
    return false;
  }
}

export async function startLocatorGeneratorUI(page: Page) {
  const locators: { page: string; locator: string }[] = [];

  let pickMode = false;

  console.log('🚀 UI Locator Generator Started');

  // 🔹 Inject UI panel
  await page.evaluate(() => {
    const panel = document.createElement('div');
    panel.id = 'pw-ui-toggle';

    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = '#111';
    panel.style.color = '#fff';
    panel.style.padding = '12px';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '9999';
    panel.style.fontSize = '14px';

    panel.innerHTML = `
      <div style="margin-bottom:8px;">Mode: <span id="pw-mode">OFF</span></div>
      <button id="pw-toggle-btn" style="padding:6px 10px;">Start Picking</button>
    `;

    document.body.appendChild(panel);

    (window as any).pwPickMode = false;

    document.getElementById('pw-toggle-btn')!.onclick = () => {
      (window as any).pwPickMode = !(window as any).pwPickMode;

      document.getElementById('pw-mode')!.innerText =
        (window as any).pwPickMode ? 'ON' : 'OFF';

      document.getElementById('pw-toggle-btn')!.innerText =
        (window as any).pwPickMode ? 'Stop Picking' : 'Start Picking';
    };
  });

  let lastLocator: string | null = null;

  while (true) {
    if (!isPageAlive(page)) break;

    try {
      const isPickMode = await page.evaluate(() => (window as any).pwPickMode);

      if (!isPickMode) {
        await page.waitForTimeout(500);
        continue;
      }

      const picked = await page.pickLocator();
      const normalized = await picked.normalize();

      const locatorString = normalized.toString();
      const currentUrl = page.url();

      // 🔁 Double click → action
      if (lastLocator === locatorString) {
        console.log('🚀 Performing action...');

        try {
          await normalized.click();
        } catch {}

        lastLocator = null;
        continue;
      }

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

      // 🔹 Highlight
      await normalized.evaluate((el: HTMLElement) => {
        el.style.outline = '3px solid red';
        el.setAttribute('data-highlighted', 'true');
      });

      lastLocator = locatorString;

    } catch {
      console.log('🛑 Stopped');
      break;
    }
  }

  // 🎯 Output
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