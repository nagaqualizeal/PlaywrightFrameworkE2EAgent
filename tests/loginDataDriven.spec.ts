import { test, expect } from '@playwright/test';
import { CommonFlows } from '../helpers/CommonFlows';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ExcelReader } from '../utils/ExcelReader';
import * as path from 'path';

test.describe('SauceDemo Data-Driven Login/Logout', () => {
    
    test('Login and logout with data from Excel', async ({ page }) => {
        // Path to Excel file
        const excelPath = path.resolve('./testdata/Data.xlsx');
        const sheetName = 'SauceLogin';
        
        // Read credentials from Excel
        const excelReader = new ExcelReader(excelPath, sheetName);
        const username = excelReader.getCellData(1, 'Username');
        const password = excelReader.getCellData(1, 'Password');

        // Login using Excel data
        await CommonFlows.login(page, username, password);

        // Verify inventory page is loaded
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.inventoryContainer).toBeVisible();

        // Logout
        await CommonFlows.logout(page);

        // Verify we are back on login page
        const loginPage = new LoginPage(page);
        await expect(loginPage.loginButton).toBeVisible();
    });
});
