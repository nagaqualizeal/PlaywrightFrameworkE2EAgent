import { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { ProductsPage } from '../pages/ProductsPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { InventoryPage } from '../pages/InventoryPage';
import { ChatBotPage } from '../pages/ChatBotPage';
import { ExcelReader } from '../utils/ExcelReader';

/**
 * Reusable business logic flows for test automation
 */
export class CommonFlows {

    /**
     * Complete shopping flow for SauceDemo
     * Logs in, adds product to cart, completes checkout, and logs out
     * @param page Playwright Page object
     */
    static async completeSauceShoppingFlow(page: Page): Promise<void> {
        const loginPage = new LoginPage(page);
        const productsPage = new ProductsPage(page);
        const checkoutPage = new CheckoutPage(page);

        // Navigate and login
        await page.goto('https://www.saucedemo.com/');
        await loginPage.login('standard_user', 'secret_sauce');

        // Add product to cart
        await productsPage.addToCartBackpack.click();
        await productsPage.shoppingCartLink.click();

        // Checkout process
        await productsPage.btnCheckout.click();
        await checkoutPage.txtFirstName.fill('naga');
        await checkoutPage.txtLastName.fill('dasam');
        await checkoutPage.txtPostalCode.fill('500081');
        await checkoutPage.btnContinue.click();
        await checkoutPage.btnFinish.click();

        // Return to products and logout
        await productsPage.btnBackToProducts.click();
        await productsPage.menuButton.click();
        await productsPage.logoutLink.click();
    }

    /**
     * Basic chatbot flow for DSS website
     * Opens chatbot, fills in basic information
     * @param page Playwright Page object
     */
    static async chatBotBasicFlow(page: Page): Promise<void> {
        const chatBotPage = new ChatBotPage(page);

        // Navigate to DSS website
        await page.goto('https://datastreetsolutions.com/', { waitUntil: 'networkidle' });

        // Wait for chatbot launcher to be visible (with extended timeout as it may load dynamically)
        await chatBotPage.btnChatBotLauncher.waitFor({ state: 'visible', timeout: 60000 });
        
        // Open chatbot
        await chatBotPage.btnChatBotLauncher.click();

        // Interact with chatbot (inside iframe)
        await chatBotPage.bubbleOption.click();
        await chatBotPage.inputTextBox.fill('Naga');
        await chatBotPage.btnSend.click();
        await chatBotPage.inputTextBox.fill('i dont know');
        await chatBotPage.btnSend.click();
        await chatBotPage.inputTextBox.fill('iwillnotgive@gmail.com');
        await chatBotPage.btnSend.click();
        await chatBotPage.btnConfirm.click();
        await chatBotPage.btnCTA.click();
    }

    /**
     * Software Testing chatbot flow with data-driven approach
     * @param page Playwright Page object
     * @param excelPath Path to Excel file
     * @param sheetName Sheet name in Excel file
     */
    static async swTestingFlow(page: Page, excelPath: string, sheetName: string): Promise<void> {
        const chatBotPage = new ChatBotPage(page);
        const excelReader = new ExcelReader(excelPath, sheetName);

        // Navigate to URL from Excel
        const url = excelReader.getCellData(1, 'URL');
        await page.goto(url, { waitUntil: 'networkidle' });

        // Wait for chatbot launcher
        await chatBotPage.btnChatBotLauncher.waitFor({ state: 'visible', timeout: 60000 });
        await chatBotPage.btnChatBotLauncher.click();

        // Click Software Testing option
        await chatBotPage.optionSWTesting.click();

        // Get all headers and iterate through them (skip URL column)
        const headers = excelReader.getHeaders();
        for (let col = 1; col < headers.length; col++) {
            const header = headers[col];
            const cellData = excelReader.getCellData(1, header);
            
            await chatBotPage.inputTextBox.fill(cellData);
            await chatBotPage.btnSend.click();
        }
    }

    /**
     * AI & Analytics chatbot flow with data-driven approach
     * @param page Playwright Page object
     * @param excelPath Path to Excel file
     * @param sheetName Sheet name in Excel file
     */
    static async aiTestingFlow(page: Page, excelPath: string, sheetName: string): Promise<void> {
        const chatBotPage = new ChatBotPage(page);
        const excelReader = new ExcelReader(excelPath, sheetName);

        // Navigate to URL from Excel
        const url = excelReader.getCellData(1, 'URL');
        await page.goto(url, { waitUntil: 'networkidle' });

        // Wait for chatbot launcher
        await chatBotPage.btnChatBotLauncher.waitFor({ state: 'visible', timeout: 60000 });
        await chatBotPage.btnChatBotLauncher.click();

        // Click AI & Analytics option
        await chatBotPage.optionAI.click();

        // Get all headers and iterate through them (skip URL column)
        const headers = excelReader.getHeaders();
        for (let col = 1; col < headers.length; col++) {
            const header = headers[col];
            const cellData = excelReader.getCellData(1, header);
            
            await chatBotPage.inputTextBox.fill(cellData);
            await chatBotPage.btnSend.click();
        }
    }

    /**
     * Login to SauceDemo with credentials
     * @param page Playwright Page object
     * @param username Username
     * @param password Password
     */
    static async login(page: Page, username: string, password: string): Promise<void> {
        const loginPage = new LoginPage(page);
        await page.goto('https://www.saucedemo.com/');
        await loginPage.login(username, password);
    }

    /**
     * Logout from SauceDemo
     * @param page Playwright Page object
     */
    static async logout(page: Page): Promise<void> {
        const inventoryPage = new InventoryPage(page);
        await inventoryPage.logout();
    }
}
