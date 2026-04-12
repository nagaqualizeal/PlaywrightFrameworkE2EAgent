import { test, expect } from '@playwright/test';
import { CommonFlows } from '../helpers/CommonFlows';
import * as path from 'path';

test.describe('Software Testing ChatBot Flow', () => {
    
    // Skip this test - chatbot not currently available on live website
    test.skip('Software Testing flow with Excel data', async ({ page }) => {
        // Increase timeout for this test
        test.setTimeout(120000);
        
        // Path to Excel file
        const excelPath = path.resolve('./testdata/ChatBotData.xlsx');
        const sheetName = 'SWData';
        
        // Execute Software Testing chatbot flow
        await CommonFlows.swTestingFlow(page, excelPath, sheetName);

        // Add a small wait to ensure flow completes
        await page.waitForTimeout(2000);
    });
});
