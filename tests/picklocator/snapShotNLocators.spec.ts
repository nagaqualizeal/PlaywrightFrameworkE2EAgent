import { test, expect } from '@playwright/test';

test('Playwright v1.59 - PickLocator + Normalize + ARIA Snapshot', async ({ page }) => {

  // 1️⃣ Navigate
  await page.goto('https://playwright.dev');

  // 2️⃣ Pick Locator (interactive)
  console.log('👉 Click on "Get started"');

  const picked = await page.pickLocator();

  console.log('-----------------------------');
  console.log('❌ PICKED LOCATOR');
  console.log(picked.toString());

  // 3️⃣ Normalize
  const normalized = await picked.normalize();

  console.log('-----------------------------');
  console.log('✅ NORMALIZED LOCATOR');
  console.log(normalized.toString());
  console.log('-----------------------------');

  // 4️⃣ Use normalized locator
  await normalized.click();

  // 5️⃣ PAGE LEVEL ARIA SNAPSHOT
  const pageSnapshot = await page.ariaSnapshot();

  console.log('🌐 PAGE ARIA SNAPSHOT (partial)');
  console.log(JSON.stringify(pageSnapshot, null, 2).slice(0, 500)); // avoid huge logs

  // 6️⃣ LOCATOR LEVEL SNAPSHOT (basic)
  const heading = page.getByRole('heading', { name: 'Installation' });

  const elementSnapshot = await heading.ariaSnapshot();

  console.log('🎯 ELEMENT SNAPSHOT (default)');
  console.log(JSON.stringify(elementSnapshot, null, 2));

  // 7️⃣ LOCATOR SNAPSHOT with depth + mode
  const detailedSnapshot = await heading.ariaSnapshot({
    depth: 2,
    mode: 'default'
  });

  console.log('🔥 ELEMENT SNAPSHOT (depth=2, mode=detailed)');
  console.log(JSON.stringify(detailedSnapshot, null, 2));

  // 8️⃣ Simple assertion using snapshot data
  expect(elementSnapshot).toContain('heading');
  expect(elementSnapshot).toContain('Installation');

});