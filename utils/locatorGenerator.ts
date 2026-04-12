import { Page } from '@playwright/test';

function generateName(locatorString: string, index: number): string {
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

export async function startLocatorGenerator(page: Page) {
  const locators: { name: string; locator: string }[] = [];

  console.log('\n🚀 Locator Generator Started');
  console.log('👉 Click elements to capture locators');
  console.log('👉 Press CTRL+C to stop\n');

  let index = 1;

  while (true) {
    try {
      const picked = await page.pickLocator();
      const normalized = await picked.normalize();

      const locatorString = normalized.toString();
      const name = generateName(locatorString, index);

      console.log(`✅ ${name} → ${locatorString}`);

      locators.push({ name, locator: locatorString });

      index++;
    } catch (e) {
      console.log('\n🛑 Locator picking stopped');
      break;
    }
  }

  // 🎯 Generate Page Object
  console.log('\n📦 ===== GENERATED PAGE OBJECT =====\n');

  console.log(`export class GeneratedPage {`);
  console.log(`  constructor(private page) {}\n`);

  locators.forEach(({ name, locator }) => {
    console.log(`  ${name} = () => this.page.${locator};`);
  });

  console.log(`\n}`);
}