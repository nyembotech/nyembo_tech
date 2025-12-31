import { test, expect } from '@playwright/test';

test.describe('AI Agents', () => {

    test('Sales Agent (Public) should be visible and responsive', async ({ page }) => {
        // Go to a public page where the Sales Agent should appear
        await page.goto('/en/solutions');

        // Check for the "Nyembo Guide" chat button (Gold theme)
        // Note: The button usually has a MessageCircle icon. We can look for the button by its aria-label or just generic button in the fixed container.
        // Based on code: fixed bottom-6 right-6
        const chatButton = page.locator('.fixed.bottom-6.right-6 button');
        await expect(chatButton).toBeVisible();

        // Open Widget
        await chatButton.click();

        // Check for Agent Name "Nyembo Guide" in the header
        await expect(page.locator('.text-sm.font-bold.text-white', { hasText: 'Nyembo Guide' })).toBeVisible();

        // Send a message
        const input = page.locator('input[placeholder="Ask about our services..."]');
        await expect(input).toBeVisible();
        await input.fill('Hello Sales Agent');
        // Click submit button explicitly as Enter might be flaky in test env or button disabled timing
        const submitButton = page.locator('button[type="submit"]');
        await expect(submitButton).toBeEnabled();
        await submitButton.click();

        // Verify input cleared (confirm submission logic ran)
        await expect(input).toHaveValue('');

        // Verify message appears in chat
        await expect(page.getByText('Hello Sales Agent')).toBeVisible({ timeout: 10000 });

        // Verify response (Mock or Real)
        // We look for ANY response bubble from assistant
        await expect(page.locator('.bg-white\\/5.text-gray-200').first()).toBeVisible({ timeout: 10000 });
    });

    test('Support Agent (Portal) should be visible and have quick actions', async ({ page }) => {
        // Login as Customer
        await page.goto('/en/login');
        await page.getByPlaceholder('name@example.com').fill('e2e-customer@nyembotech.com');
        await page.getByPlaceholder('••••••••').fill('password123');
        await page.getByRole('button', { name: 'Authenticate' }).click();
        await page.waitForURL(/\/portal/);

        // Check for the "Nyembo Support" chat button (Blue theme)
        const chatButton = page.locator('.fixed.bottom-6.right-6 button');
        await expect(chatButton).toBeVisible();

        // Open Widget
        await chatButton.click();

        // Check for Agent Name "Nyembo Support" in the header
        await expect(page.locator('.text-sm.font-bold.text-white', { hasText: 'Nyembo Support' })).toBeVisible();

        // Verify Quick Actions
        await expect(page.getByRole('button', { name: 'I need to open a ticket' })).toBeVisible();
        await expect(page.getByRole('button', { name: 'Check my ticket status' })).toBeVisible();

        // Use a Quick Action
        await page.getByRole('button', { name: 'Check my ticket status' }).click();

        // Verify it was sent
        await expect(page.getByText('Check my ticket status')).toBeVisible();

        // Verify response
        await expect(page.locator('.bg-white\\/5.text-gray-200').first()).toBeVisible();
    });
});
