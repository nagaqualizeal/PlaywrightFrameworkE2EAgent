import { Page } from '@playwright/test';
import readline from 'readline';

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(question, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    })
  );
}

function isPageAlive(page: Page): boolean {
  try {
    return !page.isClosed();
  } catch {
    return false;
  }
}

export async function startLocatorGeneratorToggle(page: Page) {
  const locators: { page: string; locator: string }[] = [];

  console.log('\n🚀 Locator Generator (Toggle Mode)');
  console.log('👉 You control when to capture and when to interact\n');

  while (true) {
    if (!isPageAlive(page)) break;

    // 🔹 Ask user: start pick mode?
    const startPick = await ask('\n👉 Start pickLocator? (yes/no/exit): ');

    if (startPick === 'exit') break;

    if (startPick !== 'yes') {
      console.log('✋ Interaction mode ON → You can freely type/click in app');
      continue;
    }

    console.log('\n🎯 Pick Mode STARTED');
    console.log('👉 Click elements to capture locators');
    console.log('👉 Close browser OR switch mode to stop\n');

    // 🔹 PICK MODE LOOP
    while (true) {
      try {
        if (!isPageAlive(page)) break;

        const currentUrl = page.url();
        console.log(`\n🌐 Page: ${currentUrl}`);
        console.log('👉 Click element to capture');

        const picked = await page.pickLocator();
        const normalized = await picked.normalize();

        const locatorString = normalized.toString();

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

        // 🔹 Ask: continue picking?
        const cont = await ask('👉 Continue picking? (yes/no): ');

        if (cont !== 'yes') {
          console.log('\n⏸️ Pick Mode STOPPED → Interaction mode enabled');
          break;
        }

      } catch {
        console.log('\n🛑 Pick mode interrupted');
        break;
      }
    }
  }

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