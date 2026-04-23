const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('trial page and navigation are present', () => {
  const sidebarNav = read('components/shell/sidebar-nav.tsx');
  const mobileNav = read('components/shell/mobile-nav.tsx');
  const trialPage = read('app/trial/page.tsx');

  assert.match(sidebarNav, /href:\s*"\/trial"/);
  assert.match(sidebarNav, /label:\s*"Trial"/);
  assert.match(mobileNav, /href:\s*"\/trial"/);
  assert.match(mobileNav, /label:\s*"Trial"/);
  assert.match(trialPage, /trial/i);
});
