import { expect, test } from '@playwright/test';

const SITE = 'https://jerusalem-virid.vercel.app/';

test('JSON-LD exposes one canonical website and district organization graph', async ({ page }) => {
  await page.goto('/');

  const nodes = page.locator('script[type="application/ld+json"]');
  await expect(nodes, 'exactly one canonical JSON-LD graph is rendered').toHaveCount(1);

  const raw = await nodes.textContent();
  expect(raw, 'JSON-LD script has content').toBeTruthy();

  const data = JSON.parse(raw!);
  expect(data['@context']).toBe('https://schema.org');
  expect(Array.isArray(data['@graph'])).toBe(true);

  const website = data['@graph'].find((node: Record<string, unknown>) => node['@type'] === 'WebSite');
  const organization = data['@graph'].find(
    (node: Record<string, unknown>) => node['@type'] === 'GovernmentOrganization'
  );

  expect(website).toMatchObject({
    '@id': `${SITE}#website`,
    url: SITE,
    name: 'מתמטיקה מחוז ירושלים',
    inLanguage: 'he-IL',
    publisher: { '@id': `${SITE}#organization` },
  });

  expect(organization).toMatchObject({
    '@id': `${SITE}#organization`,
    url: SITE,
    name: 'מתמטיקה מחוז ירושלים — משרד החינוך',
    logo: {
      '@type': 'ImageObject',
      url: `${SITE}logo.png`,
      width: 440,
      height: 440,
    },
  });
});
