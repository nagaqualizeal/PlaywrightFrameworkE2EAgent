import { Page } from 'playwright';
import readline from 'readline';

function ask(question: string): Promise<string> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise(resolve =>
    rl.question(question, (answer: string) => {
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

export async function startLocatorGeneratorSmart(page: Page) {
  const locators: { page: string; locator: string }[] = [];

  let lastLocator: string | null = null;
  let pickMode = false;

  console.log('\n🚀 Smart Locator Tool (State Mode)');

  // 🔹 Initial prompt
  const start = await ask('👉 Start pickLocator? (yes/no): ');
  pickMode = start === 'yes';

  while (true) {
    if (!isPageAlive(page)) break;

    const currentUrl = page.url();

    console.log(`\n🌐 Page: ${currentUrl}`);
    console.log(pickMode ? '🎯 Pick Mode ON' : '✋ Interaction Mode');

    try {
      // 🔴 IMPORTANT: Only run pickLocator in PICK MODE
      if (pickMode) {
        const picked = await page.pickLocator();
        const normalized = await picked.normalize();

        const locatorString = normalized.toString();

        // 🔁 DOUBLE CLICK DETECT
        if (lastLocator === locatorString) {
          const stop = await ask('👉 Stop picking and continue actions? (yes/no): ');

          if (stop === 'yes') {
            console.log('✋ Switched to Interaction Mode');
            pickMode = false;
          }

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

        lastLocator = locatorString;

      } else {
        // 🔵 INTERACTION MODE
        console.log('✋ You can freely type/click in browser');

        // 👉 Wait for user decision instead of intercepting clicks
        const startAgain = await ask('👉 Start pickLocator again? (yes/no/exit): ');

        if (startAgain === 'exit') break;

        if (startAgain === 'yes') {
          console.log('🎯 Pick Mode ON');
          pickMode = true;
          lastLocator = null;
        }
      }

    } catch {
      console.log('\n🛑 Stopped');
      break;
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