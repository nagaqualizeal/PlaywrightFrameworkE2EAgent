import { Page, Locator } from 'playwright';
import fs from 'fs';

function isPageAlive(page: Page): boolean {
  try {
    return !page.isClosed();
  } catch {
    return false;
  }
}

// 🔹 Intelligent naming with uniqueness
function generateSmartName(locator: string, index: number, used: Set<string>): string {
  const nameMatch = locator.match(/name:\s*'([^']+)'/);
  const testIdMatch = locator.match(/\[data-test="([^"]+)"\]/);

  let base = '';

  if (nameMatch) base = nameMatch[1];
  else if (testIdMatch) base = testIdMatch[1];
  else base = `element${index}`;

  // clean → camelCase
  base = base
    .replace(/[^a-zA-Z0-9 ]/g, '')
    .split(' ')
    .map((w, i) =>
      i === 0 ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()
    )
    .join('');

  if (locator.includes('button')) base += 'Btn';
  else if (locator.includes('textbox') || locator.includes('input')) base += 'Input';
  else if (locator.includes('link')) base += 'Link';

  // 🔥 Ensure uniqueness
  let finalName = base;
  let counter = 1;

  while (used.has(finalName)) {
    finalName = `${base}${counter}`;
    counter++;
  }

  used.add(finalName);
  return finalName;
}

export async function startLocatorGeneratorUIPro(page: Page) {
  const locators: { page: string; locator: string }[] = [];

  let lastLocator: string | null = null;

  console.log('🚀 UI Locator Generator (PRO)');

  // 🔹 Inject UI panel
  await page.evaluate(() => {
    const panel = document.createElement('div');
    panel.id = 'pw-ui-toggle';
    panel.setAttribute('data-pw-tool', 'true');

    panel.style.position = 'fixed';
    panel.style.bottom = '20px';
    panel.style.right = '20px';
    panel.style.background = '#111';
    panel.style.color = '#fff';
    panel.style.padding = '12px';
    panel.style.borderRadius = '8px';
    panel.style.zIndex = '9999';

    panel.innerHTML = `
      <div>Mode: <span id="pw-mode">OFF</span></div>
      <button id="pw-toggle-btn">Start Picking</button>
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

  while (true) {
    if (!isPageAlive(page)) break;

    try {
      const isPickMode = await page.evaluate(() => (window as any).pwPickMode);

      if (!isPickMode) {
        await page.waitForTimeout(200);
        continue;
      }

      const picked = await page.pickLocator();
      const normalized = await picked.normalize();

      const locatorString = normalized.toString();
      const currentUrl = page.url();

      // 🔁 Double click → perform action
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
        locators.push({ page: currentUrl, locator: locatorString });
      }

      // 🔹 Highlight
      await normalized.evaluate((el: HTMLElement) => {
        el.style.outline = '3px solid red';
      });

      lastLocator = locatorString;

    } catch {
      break;
    }
  }

  // 🎯 Generate Page Objects
  const grouped = locators.reduce((acc, item) => {
    if (!acc[item.page]) acc[item.page] = [];
    acc[item.page].push(item.locator);
    return acc;
  }, {} as Record<string, string[]>);

  let fileContent = '';

  Object.entries(grouped).forEach(([url, locs], index) => {
    const className = `Page${index + 1}`;
    const usedNames = new Set<string>();

    fileContent += `// 🌐 Page: ${url}\n`;
    fileContent += `export class ${className} {\n`;
    fileContent += `  constructor(private page) {}\n\n`;

    locs.forEach((loc, i) => {
      // 🚫 FINAL FILTER (clean approach)
      if (loc.includes('Start Picking') || loc.includes('Stop Picking')) return;

      const name = generateSmartName(loc, i + 1, usedNames);
      fileContent += `  ${name} = () => this.page.${loc};\n`;
    });

    fileContent += `}\n\n`;
  });

  fs.writeFileSync('generatedPageObjects.ts', fileContent);

  console.log('\n✅ Saved to generatedPageObjects.ts');
}