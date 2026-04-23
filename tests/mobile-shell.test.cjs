const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('mobile shell uses a burger menu instead of the bottom nav bar', () => {
  const appShell = read('components/shell/app-shell.tsx');
  const topBar = read('components/shell/top-bar.tsx');
  const mobileMenu = read('components/shell/mobile-menu.tsx');

  assert.doesNotMatch(appShell, /<MobileNav\s/);
  assert.match(topBar, /MobileMenu/);
  assert.match(topBar, /<MobileMenu\s+pathname=\{pathname\}/);
  assert.match(mobileMenu, /Open menu/i);
  assert.match(mobileMenu, /Close menu/i);
  assert.match(mobileMenu, /href:\s*"\/trial"/);
});
