import { defineConfig, devices } from '@playwright/test';
import path from 'path';

// Force every worker process to load the hook before it requires any spec
// file, so @playwright/test imports inside e2e/storefront get redirected
// to fixtures.ts without editing the spec files themselves.
const hookPath = path.resolve(__dirname, 'e2e/storefront/hook.cjs');
process.env.NODE_OPTIONS = `${process.env.NODE_OPTIONS ?? ''} -r ${hookPath}`.trim();

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list'], ['./e2e/coverage/backend-coverage-reporter.ts']],
  use: {
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'admin',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5173',
      },
      testMatch: 'admin/**/*.spec.ts',
    },
    {
      name: 'storefront',
      use: {
        ...devices['Desktop Chrome'],
        baseURL: 'http://localhost:5174',
      },
      testMatch: 'storefront/**/*.spec.ts',
    },
  ],
  webServer: [
    {
      command: 'cross-env COVERAGE=true npm run dev:server',
      url: 'http://localhost:3000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: 'npm run dev:admin',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
    {
      command: 'npm run dev:storefront',
      url: 'http://localhost:5174',
      reuseExistingServer: !process.env.CI,
      timeout: 60000,
    },
  ],
});
