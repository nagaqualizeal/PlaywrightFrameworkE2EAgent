import { Page, Locator } from '@playwright/test';

export class ProductsPage {
    readonly page: Page;
    readonly addToCartBackpack: Locator;
    readonly shoppingCartLink: Locator;
    readonly btnCheckout: Locator;
    readonly btnBackToProducts: Locator;
    readonly menuButton: Locator;
    readonly logoutLink: Locator;

    constructor(page: Page) {
        this.page = page;
        this.addToCartBackpack = page.locator('[data-test="add-to-cart-sauce-labs-backpack"]');
        this.shoppingCartLink = page.locator('[data-test="shopping-cart-link"]');
        this.btnCheckout = page.locator('[data-test="checkout"]');
        this.btnBackToProducts = page.locator('[data-test="back-to-products"]');
        this.menuButton = page.locator('#react-burger-menu-btn');
        this.logoutLink = page.locator('[data-test="logout-sidebar-link"]');
    }
}
