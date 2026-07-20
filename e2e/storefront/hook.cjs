const Module = require('module');
const path = require('path');

const originalResolve = Module._resolveFilename;

Module._resolveFilename = function (request, parent, ...rest) {
  if (
    request === '@playwright/test' &&
    parent?.filename?.includes(path.join('e2e', 'storefront'))
  ) {
    return originalResolve.call(this, path.join(__dirname, 'fixtures.ts'), parent, ...rest);
  }
  return originalResolve.call(this, request, parent, ...rest);
};