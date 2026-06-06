import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads with correct title and hero', async ({ page }) => {
    await expect(page).toHaveTitle(/Mabroka/);
    await expect(page.getByRole('heading', { level: 1 })).toContainText(
      'Blessings that bring people together'
    );
    await expect(page.locator('.hero-arabic')).toHaveText('مباركة');
  });

  test('shows primary navigation', async ({ page }) => {
    const nav = page.getByRole('navigation', { name: 'Primary' });
    await expect(nav.getByRole('link', { name: 'About' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Values' })).toBeVisible();
    await expect(nav.getByRole('link', { name: 'Contact' })).toBeVisible();
  });

  test('hero call-to-action links work', async ({ page }) => {
    await page.getByRole('link', { name: 'Learn more' }).click();
    await expect(page.locator('#about')).toBeInViewport();
  });

  test('footer shows domain and tagline', async ({ page }) => {
    await expect(page.locator('.site-footer')).toContainText('mabroka.org');
    await expect(page.locator('.footer-tagline')).toHaveText('بالبركة والخير');
  });
});
