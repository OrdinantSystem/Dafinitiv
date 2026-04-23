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

test('mobile burger controls remain clickable inside the non-interactive top-bar shell', () => {
  const topBar = read('components/shell/top-bar.tsx');
  const mobileMenu = read('components/shell/mobile-menu.tsx');

  assert.match(topBar, /pointer-events-none fixed inset-x-0 top-0 z-30 md:left-72/);
  assert.match(topBar, /className="pointer-events-auto flex shrink-0 items-center gap-2 md:gap-3"/);
  assert.match(mobileMenu, /className="pointer-events-auto inline-flex items-center gap-2 rounded-full/);
});
