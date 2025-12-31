
import { test, expect } from '@playwright/test';
import { faker } from '@faker-js/faker';

test.describe('Admin Flow', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/login');
        await page.getByLabel(/email/i).fill('e2e-admin@nyembotech.com');
        await page.getByLabel(/password/i).fill('password123');
        await page.getByRole('button', { name: /sign in/i }).click();
        await expect(page).toHaveURL(/.*\/admin/); // Assuming redirect to dashboard
    });

    test('should convert a request to a project', async ({ page }) => {
        await page.goto('/admin/requests');
        await expect(page.getByRole('heading', { name: /project requests/i })).toBeVisible();

        // Find a request (might need to seed one or use the one from public test if serial)
        // For robustness, ensure at least one request exists or create one via API (skipping for now, assuming seed/public test ran)

        // Click on a request (first one for simplicity)
        const firstRow = page.locator('tbody tr').first();
        await expect(firstRow).toBeVisible();
        await firstRow.click();

        // Drawer should open
        await expect(page.getByRole('dialog')).toBeVisible();

        // Click Convert
        await page.getByRole('button', { name: /convert/i }).click();

        // Confirm Project Details (if modal)
        // await page.getByRole('button', { name: /confirm/i }).click();

        // Assert Status Change
        await expect(page.getByText('converted')).toBeVisible();
    });

    test('should manage tasks', async ({ page }) => {
        await page.goto('/admin/tasks');

        // Add Task
        await page.getByRole('button', { name: /new task/i }).click();

        const taskTitle = `E2E Task ${faker.hacker.verb()}`;
        await page.getByLabel(/title/i).fill(taskTitle);
        await page.getByLabel(/description/i).fill('Automated test task');

        // Select Project (if required)
        const projectTrigger = page.locator('button[role="combobox"]').first(); // Assuming select
        if (await projectTrigger.isVisible()) {
            await projectTrigger.click();
            await page.getByRole('option').first().click();
        }

        await page.getByRole('button', { name: /create/i }).click();

        // Verify Task appears in "Todo" (or default column)
        await expect(page.getByText(taskTitle)).toBeVisible();

        // Move Task (Kanban Drag and Drop)
        // Assuming standard dnd-kit or similar structure
        // This is brittle without test-ids, so we'll try locating by text
        const taskCard = page.getByText(taskTitle).first();
        const doneColumn = page.getByText(/completed/i).first(); // Or specific column header

        // Simple drag to might not work with all libraries, but try:
        // await taskCard.dragTo(doneColumn); 

        // Alternative: status dropdown if available on card
    });
});
