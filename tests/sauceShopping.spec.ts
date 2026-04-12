import { test, expect } from '@playwright/test';
import { CommonFlows } from '../helpers/CommonFlows';
import { LoginPage } from '../pages/LoginPage';

test.describe('SauceDemo Shopping Flow', () => {
    
    test('Complete shopping flow - add to cart, checkout, and logout', async ({ page }) => {
        // Execute complete shopping flow
        await CommonFlows.completeSauceShoppingFlow(page);

        // Verify we are back on login page after logout
        const loginPage = new LoginPage(page);
        await expect(loginPage.loginButton).toBeVisible();
    });
});
