import { test, expect } from '@playwright/test';

test.describe('Contact form', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });
    await page.goto('/#contact');
  });

  test('submits successfully with valid input', async ({ page }) => {
    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Message').fill('Hello from Playwright.');

    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('status')).toBeVisible();
    await expect(page.getByRole('status')).toContainText('Thank you');
    await expect(page.getByLabel('Name')).toHaveValue('');
  });

  test('shows error when submission fails', async ({ page }) => {
    await page.unroute('**/formspree.io/**');
    await page.route('**/formspree.io/**', async (route) => {
      await route.fulfill({ status: 500, body: 'Server error' });
    });

    await page.getByLabel('Name').fill('Test User');
    await page.getByLabel('Email').fill('test@example.com');
    await page.getByLabel('Message').fill('This should fail.');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('alert')).toBeVisible();
    await expect(page.getByRole('alert')).toContainText('Something went wrong');
  });

  test('ignores honeypot submissions', async ({ page }) => {
    let submitted = false;
    await page.unroute('**/formspree.io/**');
    await page.route('**/formspree.io/**', async (route) => {
      submitted = true;
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ ok: true }),
      });
    });

    await page.locator('input[name="_gotcha"]').fill('bot');
    await page.getByLabel('Name').fill('Bot');
    await page.getByLabel('Email').fill('bot@example.com');
    await page.getByLabel('Message').fill('Spam');
    await page.getByRole('button', { name: 'Send message' }).click();

    await expect(page.getByRole('status')).toBeHidden();
    await expect(page.getByRole('alert')).toBeHidden();
    expect(submitted).toBe(false);
  });
});
