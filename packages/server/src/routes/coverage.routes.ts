import { Router } from 'express';

const router = Router();

// GET /__coverage__ - return current Istanbul coverage snapshot
router.get('/', (_req, res) => {
  const coverage = (global as any).__coverage__ || {};

  console.log('Coverage files:', Object.keys(coverage).length);
  for (const file of Object.keys(coverage)) {
    console.log(file);
    console.log('Statements:', coverage[file].s);
  }

  res.setHeader('Content-Type', 'application/json');
  res.json(coverage);
});

// POST /__coverage__/reset - zero out all counters in place
router.post('/reset', (_req, res) => {
  const coverage = (global as any).__coverage__ || {};

  for (const filePath of Object.keys(coverage)) {
    const fileCov = coverage[filePath];

    for (const k of Object.keys(fileCov.s)) {
      fileCov.s[k] = 0;
    }
    for (const k of Object.keys(fileCov.f)) {
      fileCov.f[k] = 0;
    }
    for (const k of Object.keys(fileCov.b)) {
      fileCov.b[k] = fileCov.b[k].map(() => 0);
    }
  }

  res.send('ok');
});

export default router;