import { Page, Locator } from '@playwright/test';

export class CheckoutPage {
    readonly page: Page;
    readonly txtFirstName: Locator;
    readonly txtLastName: Locator;
    readonly txtPostalCode: Locator;
    readonly btnContinue: Locator;
    readonly btnFinish: Locator;

    constructor(page: Page) {
        this.page = page;
        this.txtFirstName = page.locator('[data-test="firstName"]');
        this.txtLastName = page.locator('[data-test="lastName"]');
        this.txtPostalCode = page.locator('[data-test="postalCode"]');
        this.btnContinue = page.locator('[data-test="continue"]');
        this.btnFinish = page.locator('[data-test="finish"]');
    }
}
