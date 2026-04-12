import { test, expect } from '@playwright/test';
import { CommonFlows } from '../helpers/CommonFlows';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('SauceDemo Basic Login/Logout', () => {
    
    test('Login and logout successfully', async ({ page }) => {
        // Login
        await CommonFlows.login(page, 'standard_user', 'secret_sauce');

        // Verify inventory page is loaded
        const inventoryPage = new InventoryPage(page);
        await expect(inventoryPage.inventoryContainer).toBeVisible();

        // Logout
        await CommonFlows.logout(page);

        // Verify we are back on login page
        const loginPage = new LoginPage(page);
        await expect(loginPage.loginButton).toBeVisible();
    });

    test('Verify page title after login', async ({ page }) => {
        // Login
        await CommonFlows.login(page, 'standard_user', 'secret_sauce');

        // Verify page title
        await expect(page).toHaveTitle(/Swag Labs/);

        // Logout
        await CommonFlows.logout(page);
    });
});
