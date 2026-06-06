import { test, expect } from '@playwright/test';

test.describe('SEO and static assets', () => {
  test('has social meta tags', async ({ page }) => {
    await page.goto('/');

    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute(
      'content',
      /Mabroka/
    );
    await expect(page.locator('meta[property="og:url"]')).toHaveAttribute(
      'content',
      'https://mabroka.org/'
    );
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'https://mabroka.org/'
    );
  });

  test('serves favicon and sitemap', async ({ request }) => {
    const favicon = await request.get('/favicon.svg');
    expect(favicon.ok()).toBeTruthy();
    expect(favicon.headers()['content-type']).toContain('image/svg');

    const sitemap = await request.get('/sitemap.xml');
    expect(sitemap.ok()).toBeTruthy();
    await expect(sitemap.text()).resolves.toContain('https://mabroka.org/');

    const ogImage = await request.get('/og-image.svg');
    expect(ogImage.ok()).toBeTruthy();
  });
});
