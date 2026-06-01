import { test, expect } from '@playwright/test';

const routes = [
  { path: '/',                        name: 'Home' },
  { path: '/work',                    name: 'Work index' },
  { path: '/about',                   name: 'About' },
  { path: '/work/insights-service',   name: 'Insights Service' },
  { path: '/work/later-360',          name: 'Later 360' },
  { path: '/work/aptean',             name: 'Aptean' },
];

// ── Per-route smoke tests ─────────────────────────────────────────────────────
for (const { path, name } of routes) {
  test.describe(name, () => {
    test('loads with HTTP 200', async ({ page }) => {
      const res = await page.goto(path);
      expect(res?.status()).toBe(200);
    });

    test('has <nav>', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('nav')).toBeVisible();
    });

    test('has <h1>', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main h1').first()).toBeVisible();
    });

    test('has <main>', async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main')).toBeVisible();
    });

    test('nav is 4-column grid (not broken)', async ({ page }) => {
      await page.goto(path);
      const columns = await page.locator('.nav-inner').evaluate(
        el => getComputedStyle(el).gridTemplateColumns
      );
      // 4-column: "Xpx Xpx Xpx Xpx" — 4 space-separated values
      const parts = columns.trim().split(/\s+/);
      expect(parts.length, `Nav grid broken on ${path}: ${columns}`).toBe(4);
    });
  });
}

// ── Internal link integrity ───────────────────────────────────────────────────
for (const { path, name } of routes) {
  test(`${name}: no broken internal links`, async ({ page }) => {
    await page.goto(path);

    const hrefs = await page.$$eval(
      'a[href^="/"]',
      els => [...new Set(els.map(a => a.getAttribute('href')).filter(Boolean))] as string[]
    );

    for (const href of hrefs) {
      // Skip anchors and non-page paths
      if (href.includes('#') || href.startsWith('/api/')) continue;
      const res = await page.request.get(href);
      expect(res.status(), `Broken link on ${path}: ${href} → ${res.status()}`).toBe(200);
    }
  });
}

// ── Content spot-checks ───────────────────────────────────────────────────────
test('Home: hero headline visible', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('main h1').first()).toContainText(/build|foundations/i);
});

test('Home: chatbot teaser chips visible on desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.goto('/');
  await expect(page.locator('.hero-teaser')).toBeVisible();
  const chips = page.locator('.ht-chip');
  await expect(chips).toHaveCount(3);
});

test('Work index: lists all 3 case studies', async ({ page }) => {
  await page.goto('/work');
  await expect(page.locator('a[href="/work/insights-service"]')).toBeVisible();
  await expect(page.locator('a[href="/work/later-360"]')).toBeVisible();
  await expect(page.locator('a[href="/work/aptean"]')).toBeVisible();
});

test('Insights Service: has next-study link to Later 360', async ({ page }) => {
  await page.goto('/work/insights-service');
  await expect(page.locator('a[href="/work/later-360"]')).toBeVisible();
});

test('Later 360: has next-study link to Aptean', async ({ page }) => {
  await page.goto('/work/later-360');
  await expect(page.locator('a[href="/work/aptean"]')).toBeVisible();
});

test('Aptean: no next-study link (last case study)', async ({ page }) => {
  await page.goto('/work/aptean');
  // Should only have the "← All work" back link, not a next link
  const csbkLinks = page.locator('.csbk-link');
  await expect(csbkLinks).toHaveCount(1);
});
