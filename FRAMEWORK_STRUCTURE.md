# Playwright-TypeScript Framework Structure

## Overview
This framework is migrated from a Selenium-Java based test automation framework to Playwright-TypeScript. It follows the Page Object Model (POM) pattern with reusable helper functions and supports data-driven testing using Excel files.

## Framework Architecture

### Folder Structure
```
PlaywrightFramework/
├── pages/               # Page Object classes (locators only)
│   ├── LoginPage.ts
│   ├── InventoryPage.ts
│   ├── ProductsPage.ts
│   ├── CheckoutPage.ts
│   └── ChatBotPage.ts
├── tests/               # Test specification files
│   ├── login.spec.ts
│   ├── loginBasic.spec.ts
│   ├── loginDataDriven.spec.ts
│   ├── sauceShopping.spec.ts
│   ├── chatbotBasic.spec.ts
│   ├── swTesting.spec.ts
│   └── aiAnalytics.spec.ts
├── helpers/             # Reusable business logic
│   └── CommonFlows.ts
├── utils/               # Utility classes
│   └── ExcelReader.ts
├── testdata/            # Test data files
│   ├── ChatBotData.xlsx
│   └── Data.xlsx
├── playwright-report/   # HTML test reports
├── test-results/        # Test execution results
├── playwright.config.ts # Playwright configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Dependencies and scripts
```

## Key Components

### 1. Page Objects (`pages/`)
Page Object classes contain only locators (Playwright Locator objects). No business logic is included in these classes.

**Pattern:**
```typescript
export class PageName {
    readonly page: Page;
    readonly elementName: Locator;
    
    constructor(page: Page) {
        this.page = page;
        this.elementName = page.locator('selector');
    }
}
```

**Available Page Objects:**
- `LoginPage.ts` - SauceDemo login page
- `InventoryPage.ts` - SauceDemo inventory/products page
- `ProductsPage.ts` - Shopping cart and checkout elements
- `CheckoutPage.ts` - Checkout form elements
- `ChatBotPage.ts` - DSS website chatbot with iframe support

### 2. Helper Functions (`helpers/CommonFlows.ts`)
Contains reusable business logic and test flows. All methods are static and accept `Page` object as parameter.

**Available Flows:**
- `completeSauceShoppingFlow(page)` - Complete e-commerce shopping workflow
- `chatBotBasicFlow(page)` - Basic chatbot interaction
- `swTestingFlow(page, excelPath, sheetName)` - Software Testing chatbot with Excel data
- `aiTestingFlow(page, excelPath, sheetName)` - AI & Analytics chatbot with Excel data
- `login(page, username, password)` - Login to SauceDemo
- `logout(page)` - Logout from SauceDemo

### 3. Utilities (`utils/ExcelReader.ts`)
Excel file reading utility for data-driven testing.

**Methods:**
- `getCellData(rowNum, columnName)` - Get cell value by row and column name
- `getRowCount()` - Get total number of rows
- `getColumnCount(rowNum)` - Get column count for specific row
- `getHeaders()` - Get all column headers

**Error Handling:**
- Throws descriptive errors for missing files, sheets, or invalid data
- Type-safe with TypeScript strict mode compliance

### 4. Test Data (`testdata/`)
Excel files containing test data copied from the original Selenium framework:
- `ChatBotData.xlsx` - Contains "SWData" and "AIData" sheets for chatbot tests
- `Data.xlsx` - Contains "SauceLogin" sheet for login tests

## Test Specifications

### Migrated Tests (6 of 6 Complete)

| Test File | Status | Description | Source |
|-----------|--------|-------------|---------|
| `sauceShopping.spec.ts` | ✅ Passing | Complete shopping flow test | SauceShoppingTest.java |
| `loginBasic.spec.ts` | ✅ Passing | Basic login/logout tests | TC1.java |
| `loginDataDriven.spec.ts` | ✅ Passing | Data-driven login from Excel | TC2.java |
| `chatbotBasic.spec.ts` | ⏭️ Skipped | Basic chatbot interaction | ChatBotTest.java |
| `swTesting.spec.ts` | ⏭️ Skipped | Software Testing chatbot with Excel | SWTestingFlow.java |
| `aiAnalytics.spec.ts` | ⏭️ Skipped | AI & Analytics chatbot with Excel | AITestingFlow.java |

**Note:** Chatbot tests are skipped because the chatbot is not currently active on the live website. They can be enabled when the chatbot is available.

## Configuration

### Playwright Configuration (`playwright.config.ts`)
- **Base URL:** https://www.saucedemo.com
- **Browser:** Chromium (Desktop Chrome)
- **Parallel Execution:** Enabled
- **Retries:** 2 on CI, 0 locally
- **Screenshots:** On failure
- **Videos:** Enabled
- **Trace:** On first retry
- **Reporter:** HTML + list

### TypeScript Configuration (`tsconfig.json`)
- **Strict Mode:** Enabled (with proper type guards)
- **Target:** ESNext
- **Module:** Commonjs
- **Source Maps:** Enabled

## Running Tests

### Execute All Tests
```powershell
npx playwright test
```

### Execute Specific Test File
```powershell
npx playwright test sauceShopping.spec.ts
```

### Execute Tests in Headed Mode
```powershell
npx playwright test --headed
```

### Execute Tests in UI Mode (Interactive)
```powershell
npx playwright test --ui
```

### View HTML Report
```powershell
npx playwright show-report
```

### Execute Specific Test by Name
```powershell
npx playwright test -g "Complete shopping flow"
```

## Migration Summary

### What Was Migrated

**From Selenium-Java Framework:**
- ✅ 6 test classes → 6 test specification files
- ✅ 5 Page Object classes → 5 TypeScript Page Objects
- ✅ CommonFunctions.java → CommonFlows.ts helper class
- ✅ ExcelUtils.java (POI/Fillo) → ExcelReader.ts (xlsx library)
- ✅ Test data files (ChatBotData.xlsx, Data.xlsx)
- ✅ Data-driven testing approach
- ✅ Page Object Model pattern

### Key Differences from Selenium Framework

| Aspect | Selenium-Java | Playwright-TypeScript |
|--------|---------------|----------------------|
| **Language** | Java | TypeScript |
| **Test Framework** | TestNG | @playwright/test |
| **Waits** | Explicit/Implicit | Auto-wait (built-in) |
| **Page Objects** | Static `By` locators | Instance `Locator` objects |
| **Excel Library** | Apache POI / Fillo | xlsx |
| **Reporting** | ExtentReports | Playwright HTML Reporter |
| **Browser Management** | WebDriver | Playwright manages browsers |
| **Assertions** | TestNG Assert | Playwright expect |
| **Action Layer** | ActionDriver wrapper | Direct Playwright API |

### Advantages of Playwright Migration

1. **Auto-waiting** - No need for explicit waits; Playwright automatically waits for elements
2. **Better Error Messages** - More descriptive error messages and stack traces
3. **Built-in Assertions** - Modern assertion library with auto-retry
4. **Parallel Execution** - Better parallel test execution out of the box
5. **Modern Tooling** - TypeScript provides better IDE support and type safety
6. **Network Interception** - Easy API mocking and request/response inspection
7. **Multiple Browser Support** - Chromium, Firefox, WebKit with same API
8. **Video & Trace** - Built-in video recording and trace viewer for debugging

## Framework Maintenance

### Adding New Tests
1. Create Page Object (if needed) in `pages/` folder
2. Add reusable flow to `helpers/CommonFlows.ts` (if applicable)
3. Create test specification in `tests/` folder
4. Run and validate the test

### Adding New Test Data
1. Place Excel file in `testdata/` folder
2. Use `ExcelReader` class to read data
3. Pass data to helper functions or use directly in tests

### Updating Page Objects
1. Update locators in respective Page Object class
2. No need to update test files (if using helpers)
3. Run tests to validate changes

## Parallel Framework Operation

Both Selenium-Java and Playwright-TypeScript frameworks coexist in the workspace:
- **Selenium Framework:** `c:\Projects_Naga\ChatBotAutomation_Working`
- **Playwright Framework:** `d:\PlayWirghtProjects\PlaywrightFramework`

This allows gradual transition and comparison between frameworks during the migration phase.

## Future Enhancements

1. **Enable Chatbot Tests** - Once chatbot is active on live website
2. **Custom Reporters** - Add Allure or custom HTML reporters for enhanced reporting
3. **Test Fixtures** - Create base test class for common setup/teardown
4. **CI/CD Integration** - Set up GitHub Actions or Azure DevOps pipelines
5. **API Testing** - Add API test cases using Playwright's request library
6. **Visual Testing** - Add visual regression testing using Playwright's screenshot comparison

## Support & Documentation

- **Playwright Docs:** https://playwright.dev
- **TypeScript Docs:** https://www.typescriptlang.org/docs
- **xlsx Library:** https://www.npmjs.com/package/xlsx

---

**Migration Completed:** December 4, 2025  
**Framework Version:** 1.0  
**Playwright Version:** 1.40.0  
**TypeScript Version:** 5.3.0
