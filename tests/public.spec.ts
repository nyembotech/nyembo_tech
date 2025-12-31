
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Public User Flow', () => {
    test('should submit a project request successfully', async ({ page }) => {
        // 1. Visit Home
        await page.goto('/');
        await expect(page).toHaveTitle(/Nyembotech/);
        await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

        // 2. Navigate to Contact
        await page.goto('/contact');
        await expect(page).toHaveURL(/.*contact/);
        await expect(page.getByRole('heading', { name: /launch a project/i })).toBeVisible();

        // 3. Step 1: Identification
        const testCompany = `E2E Test ${faker.company.name()}`;
        const testName = faker.person.fullName();
        const testEmail = faker.internet.email();

        await page.getByLabel(/full name/i).fill(testName);
        await page.getByLabel(/email address/i).fill(testEmail);
        await page.getByLabel(/company/i).fill(testCompany);
        await page.getByLabel(/country/i).fill('E2E Land');

        await page.getByRole('button', { name: /next step/i }).click();

        // 4. Step 2: Mission Parameters
        await expect(page.getByText(/mission parameters/i)).toBeVisible();

        await page.getByLabel(/problem description/i).fill('This is an automated E2E test project request from Playwright.');

        // Selects are tricky in Shadcn/Radix, often need to click trigger then option
        // Solution Type - First combobox is Solution
        await expect(page.getByRole('combobox').first()).toBeVisible();
        await page.getByRole('combobox').first().click();
        await page.getByRole('option').first().click();

        // Timeline - defaults might be okay, or select one
        // await page.getByText(/select timeline/i).click();
        // await page.getByRole('option').first().click();

        await page.getByRole('button', { name: /next step/i }).click();

        // 5. Step 3: Resources & Launch
        await expect(page.getByText(/resources & launch/i)).toBeVisible();

        // Click a budget option
        await page.getByRole('button', { name: '$10k - $25k' }).click();

        // Submit
        await page.getByRole('button', { name: /launch mission/i }).click();

        // 6. Verify Success & Code
        // Expecting a success message or redirection
        await expect(page.getByText(/mission received/i)).toBeVisible({ timeout: 15000 });
        await expect(page.getByText(/request code/i)).toBeVisible();

        // Optional: Capture the code
        // const codeElement = page.locator('some-selector');
        // const code = await codeElement.textContent();
        // console.log(`Generated Code: ${code}`);
    });
});
