
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Customer Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/email/i).fill('e2e-customer@nyembotech.com');
        await page.getByLabel(/password/i).fill('password123');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/.*\/portal/);
    });

    test('should view dashboard and create a ticket', async ({ page }) => {
        // Portal Dashboard
        await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();
        await expect(page.getByText(/your projects/i)).toBeVisible();

        // Navigate to a Project (assuming List)
        // await page.locator('.project-card').first().click();
        // OR create ticket directly if global button

        // Let's assume Support/Tickets Page
        await page.goto('/portal?tab=support'); // or navigate via UI
        // If navigation is required:
        // await page.getByRole('link', { name: /support/i }).click();

        await page.getByRole('button', { name: /new ticket/i }).click();

        const subject = `Help Needed ${faker.hacker.noun()}`;
        await page.getByLabel(/subject/i).fill(subject);
        await page.getByLabel(/description/i).fill('I found a bug in the matrix.');
        await page.getByRole('button', { name: /submit/i }).click();

        // Verify
        await expect(page.getByText(subject)).toBeVisible();
    });
});
