import { test as base, expect } from '../../node_modules/@playwright/test';
import fs from 'fs';
import path from 'path';


function sanitize(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_");
}

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    try {
      await use(page);
    } finally {
      try {
        const coverage = await page.evaluate(() => (window as any).__coverage__);

        // titlePath looks like: ['storefront', 'e2e/storefront/menu.spec.ts', 'Menu', 'shows loading state']
        // Drop the project name (index 0), join the rest, sanitize each piece
        const uniqueName = testInfo.titlePath
          .slice(1)
          .map(sanitize)
          .join('__');

        const folder = path.join(
          process.cwd(),
          'output',
          'storefront',
          uniqueName
        );

        fs.mkdirSync(folder, { recursive: true });

        fs.writeFileSync(
          path.join(folder, 'frontend.json'),
          JSON.stringify(coverage ?? {}, null, 2)
        );

        console.log(`Saved coverage for: ${testInfo.title}`);
      } catch (err) {
        console.error(
          `Could not save coverage for "${testInfo.title}"`,
          err
        );
      }
    }
  },
});

export { expect } from '../../node_modules/@playwright/test';