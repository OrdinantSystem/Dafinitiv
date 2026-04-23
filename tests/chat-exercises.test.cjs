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
  assert.match(chatComponent, /mobileEdgeToEdge\?: boolean/);
  assert.match(chatComponent, /mobileEdgeToEdge = false/);
  assert.match(chatComponent, /exerciseMode\?: boolean/);
  assert.match(chatComponent, /exerciseMode = false/);
  assert.match(chatComponent, /minimumComposerHeight = exerciseMode \? 24 : 28/);
  assert.match(chatComponent, /composerPlaceholder = exerciseMode \? "Type here…" : `Message \$\{runtime\.model\}\.\.\.`/);
  assert.match(chatComponent, /exerciseMode \? "hidden md:flex flex-wrap gap-3" : "flex flex-wrap gap-3"/);
  assert.match(chatComponent, /hidden md:inline-flex items-center gap-2 rounded-full bg-surface-container-low/);
  assert.match(chatComponent, /exerciseMode \? "min-h-\[calc\(100dvh-7rem\)\] md:min-h-\[720px\]" : "min-h-\[720px\]"/);
  assert.match(chatComponent, /padding=\{exerciseMode \? "none" : "default"\}/);
  assert.match(chatComponent, /exerciseMode \? "px-\[5px\] pb-0 pt-2" : "px-1 pb-1 pt-5"/);
  assert.match(chatComponent, /exerciseMode \? "relative rounded-\[1\.45rem\] px-\[5px\] py-2" : "rounded-\[1\.7rem\] px-3\.5 py-2\.5"/);
  assert.match(chatComponent, /exerciseMode \? "max-w-\[96%\] px-2\.5 py-2" : "max-w-\[80%\] px-3 py-2"/);
  assert.match(chatComponent, /exerciseMode[\s\S]*\? "max-w-\[98%\] bg-surface-container-low text-on-surface-variant ghost-outline"/);
  assert.match(detailPage, /className="space-y-5 hidden md:block"/);
  assert.match(chatComponent, /pointer-events-none absolute inset-y-0 right-2 flex items-end pb-2/);
  assert.match(detailPage, /content: `\$\{exercise\.title\}\. Start when you're ready\.`/);
  assert.match(detailPage, /conversationSubtitle="Exercise"/);
  assert.match(detailPage, /mobileEdgeToEdge/);
  assert.match(detailPage, /exerciseMode/);
  assert.doesNotMatch(detailPage, /dynamic\s*=\s*"force-dynamic"/);

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
