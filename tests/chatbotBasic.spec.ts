import { test, expect } from '@playwright/test';
import { CommonFlows } from '../helpers/CommonFlows';

test.describe('ChatBot Basic Flow', () => {
    
    // Skip this test - chatbot not currently available on live website
    test.skip('Complete basic chatbot interaction flow', async ({ page }) => {
        // Increase timeout for this test as chatbot may take time to load
        test.setTimeout(90000);
        
        // Execute chatbot basic flow
        await CommonFlows.chatBotBasicFlow(page);

        // Add a small wait to ensure flow completes
        await page.waitForTimeout(2000);
    });
});
