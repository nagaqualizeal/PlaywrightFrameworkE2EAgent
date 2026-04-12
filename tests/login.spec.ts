import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';

test.describe('SauceDemo Login and Logout', () => {
  test('should login and logout successfully', async ({ page }) => {
    const loginPage = new LoginPage(page);
    const inventoryPage = new InventoryPage(page);

    // Navigate to the application
    await loginPage.goto();

    // Login with valid credentials
    await loginPage.login('standard_user', 'secret_sauce');

    // Verify login was successful
    await inventoryPage.isLoaded();
    await expect(inventoryPage.inventoryContainer).toBeVisible();

    // Logout from the application
    await inventoryPage.logout();

    // Verify logout was successful - should be back on login page
    await expect(loginPage.loginButton).toBeVisible();
  });
});
