const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('mobile menu only mounts drawer content when open and supports escape close', () => {
  const mobileMenu = read('components/shell/mobile-menu.tsx');

  assert.match(mobileMenu, /const drawer = open \? \(/);
  assert.match(mobileMenu, /key === "Escape"/);
  assert.match(mobileMenu, /aria-modal=\{true\}/);
  assert.match(mobileMenu, /role="dialog"/);
  assert.match(mobileMenu, /createPortal\(drawer, document\.body\)/);
});

test('mobile menu renders its drawer through a body portal instead of inside the blurred top bar', () => {
  const mobileMenu = read('components/shell/mobile-menu.tsx');

  assert.match(mobileMenu, /from "react-dom"/);
  assert.match(mobileMenu, /createPortal\(/);
  assert.match(mobileMenu, /document\.body/);
});
