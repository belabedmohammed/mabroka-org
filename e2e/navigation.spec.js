import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('desktop nav scrolls to sections', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/');

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Values' }).click();
    await expect(page.locator('#values')).toBeInViewport();

    await page.getByRole('navigation', { name: 'Primary' }).getByRole('link', { name: 'Contact' }).click();
    await expect(page.locator('#contact')).toBeInViewport();
  });

  test('mobile menu opens and closes', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');

    const toggle = page.getByRole('button', { name: 'Open menu' });
    const nav = page.getByRole('navigation', { name: 'Primary' });

    await toggle.click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(nav).toHaveClass(/is-open/);

    await nav.getByRole('link', { name: 'About' }).click();
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(nav).not.toHaveClass(/is-open/);
    await expect(page.locator('#about')).toBeInViewport();
  });
});
