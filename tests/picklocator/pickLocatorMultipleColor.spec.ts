import { test } from '@playwright/test';

function generateName(locatorString: string, index: number): string {
  // Try extracting name from locator
  const match = locatorString.match(/name:\s*['"`](.*?)['"`]/);

  if (match && match[1]) {
    return match[1]
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, ' ')
      .trim()
      .split(' ')
      .map((word, i) =>
        i === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)
      )
      .join('');
  }

  return `element${index}`;
}

// 🔴 Highlight picked element with red border
async function highlightElement(locator: any): Promise<void> {
  try {
    await locator.evaluate((el: HTMLElement) => {
      el.style.outline = '4px solid red';
      el.style.outlineOffset = '2px';
      el.setAttribute('data-highlighted', 'true');
    });
  } catch {
    // ignore if highlighting fails
  }
}

test('Generate Page Object automatically', async ({ page }) => {

  await page.goto('https://playwright.dev');

  const locators: { name: string; locator: string }[] = [];

  console.log('👉 Pick elements one by one');
  console.log('👉 Press CTRL+C when done\n');

  let index = 1;

  while (true) {
    try {
      const picked = await page.pickLocator();
      const normalized = await picked.normalize();

      // 🔴 Highlight the picked element
      await highlightElement(normalized);

      const locatorString = normalized.toString();

      const name = generateName(locatorString, index);

      console.log(`✅ ${name} → ${locatorString}`);

      locators.push({ name, locator: locatorString });

      index++;

    } catch (e) {
      console.log('\n🛑 Stopped picking elements.');
      break;
    }
  }

  // 🎯 Generate Page Object Class
  console.log('\n📦 ===== GENERATED PAGE OBJECT =====\n');

  console.log(`export class GeneratedPage {`);
  console.log(`  constructor(private page) {}\n`);

  locators.forEach(({ name, locator }) => {
    console.log(`  ${name} = () => this.page.${locator};`);
  });

  console.log(`\n}`);
});