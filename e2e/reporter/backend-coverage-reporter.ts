import type { Reporter, TestCase } from '@playwright/test/reporter';
import fs from 'fs';
import path from 'path';

// Must match the sanitize() used in admin/fixtures.ts and storefront/fixtures.ts
function sanitize(name: string) {
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_');
}

/**
 * Reproduces the exact folder each frontend fixture writes frontend.json to,
 * so backend.json lands in the SAME folder instead of a new one.
 *
 * test.titlePath() = ['', projectName, filePath, ...describeTitles, testTitle]
 * (the leading '' is the root suite - testInfo.titlePath() in the fixtures
 * omits it, which is why fixtures use .slice(1) but we use .slice(2) here)
 */
function getOutputFolder(test: TestCase): string {
  const titlePath = test.titlePath();
  const projectName = titlePath[1];

  // Fallback for any other/future project - keep it consistent with storefront's scheme
  const uniqueName = titlePath.slice(3).map(sanitize).join('__');
  return path.join('output', projectName ?? 'unknown', uniqueName);
}

export default class BackendCoverageReporter implements Reporter {
  async onTestBegin() {
    await fetch('http://127.0.0.1:3000/__coverage__/reset', { method: 'POST' });
  }

  async onTestEnd(test: TestCase) {
    const res = await fetch('http://127.0.0.1:3000/__coverage__');
    const coverage = await res.text();

    const folder = getOutputFolder(test);
    fs.mkdirSync(folder, { recursive: true });
    fs.writeFileSync(path.join(folder, 'backend.json'), coverage);
  }
}