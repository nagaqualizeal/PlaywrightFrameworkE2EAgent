# Playwright TypeScript Framework

A Playwright automation framework using TypeScript and Page Object Model (POM) pattern.

## Project Structure

```
PlaywrightFramework/
├── pages/              # Page Object Model classes
│   ├── LoginPage.ts
│   └── InventoryPage.ts
├── tests/              # Test specifications
│   └── login.spec.ts
├── playwright.config.ts
├── tsconfig.json
└── package.json
```

## Features

- TypeScript for type safety
- Page Object Model design pattern
- HTML report generation
- Chromium browser testing
- Screenshots and videos on failure

## Installation

```bash
npm install
npx playwright install
```

## Running Tests

```bash
# Run all tests
npm test

# Run tests in headed mode
npm run test:headed

# Open HTML report
npm run report
```

## Test Coverage

- Login to SauceDemo application
- Verify successful login
- Logout from application
- Verify successful logout

## HTML Report

After test execution, the HTML report is generated in the `playwright-report` folder.
View it with: `npx playwright show-report`
