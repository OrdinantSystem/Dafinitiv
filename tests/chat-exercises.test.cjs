const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const projectRoot = path.resolve(__dirname, '..');

function read(relativePath) {
  return fs.readFileSync(path.join(projectRoot, relativePath), 'utf8');
}

test('chat exercise routes, catalog, and prompt files are present', () => {
  const catalog = read('lib/chat-exercises/catalog.ts');
  const indexPage = read('app/chat-exercises/page.tsx');
  const detailPage = read('app/chat-exercises/[slug]/page.tsx');
  const chatComponent = read('components/llm-test/llm-test-chat.tsx');

  assert.match(indexPage, /chat exercises/i);
  assert.match(detailPage, /getChatExerciseBySlug/);
  assert.match(chatComponent, /defaultSystemPromptId/);
  assert.match(chatComponent, /lockSystemPrompt/);

  const expectedSlugs = [
    'grammar-repair-studio',
    'argument-builder',
    'source-synthesis-coach',
    'speaking-outline-coach',
    'register-rewrite-lab'
  ];

  for (const slug of expectedSlugs) {
    assert.match(catalog, new RegExp(`slug: "${slug}"`));
  }

  const expectedPromptFiles = [
    'prompts/training/chat/grammar-repair-studio.md',
    'prompts/training/chat/argument-builder.md',
    'prompts/training/chat/source-synthesis-coach.md',
    'prompts/training/chat/speaking-outline-coach.md',
    'prompts/training/chat/register-rewrite-lab.md'
  ];

  for (const promptPath of expectedPromptFiles) {
    const absolute = path.join(projectRoot, promptPath);
    assert.equal(fs.existsSync(absolute), true, `${promptPath} should exist`);
  }
});
