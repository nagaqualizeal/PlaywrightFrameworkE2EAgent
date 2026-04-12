import { Page, Locator, FrameLocator } from '@playwright/test';

export class ChatBotPage {
    readonly page: Page;
    readonly btnChatBotLauncher: Locator;
    readonly chatBotFrame: FrameLocator;
    readonly optionSWTesting: Locator;
    readonly optionAI: Locator;
    readonly inputTextBox: Locator;
    readonly btnSend: Locator;
    readonly bubbleOption: Locator;
    readonly btnConfirm: Locator;
    readonly btnCTA: Locator;

    constructor(page: Page) {
        this.page = page;
        this.btnChatBotLauncher = page.locator('#chat-bot-launcher-button');
        this.chatBotFrame = page.frameLocator('#chat-bot-iframe');
        
        // Locators within the iframe
        this.optionSWTesting = this.chatBotFrame.locator('//div[contains(text(),"Software Testing")]');
        this.optionAI = this.chatBotFrame.locator('//div[contains(text(),"AI & Analytics")]');
        this.inputTextBox = this.chatBotFrame.locator('#textInput');
        this.btnSend = this.chatBotFrame.locator('.send-button');
        this.bubbleOption = this.chatBotFrame.locator('.bubble:nth-child(2) > div');
        this.btnConfirm = this.chatBotFrame.locator('button');
        this.btnCTA = this.chatBotFrame.locator('.cta-btn');
    }
}
