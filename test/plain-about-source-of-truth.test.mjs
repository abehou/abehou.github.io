import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);

const [indexHtml, terminalJs, meJsonRaw] = await Promise.all([
  readFile(new URL('index.html', root), 'utf8'),
  readFile(new URL('terminal.js', root), 'utf8'),
  readFile(new URL('data/me.json', root), 'utf8'),
]);

const me = JSON.parse(meJsonRaw);
const introSentence =
  'I am interested in understanding **how people can supervise and interpret AI systems when the answers are hard to verify.**';

assert.match(me.content, new RegExp(escapeRegExp(introSentence)));

assert.match(
  indexHtml,
  /<div id="pv-about-body"><!-- rendered by terminal\.js --><\/div>/,
  'plain about section should be a render target, not hand-written duplicate prose',
);

assert.doesNotMatch(
  indexHtml,
  /human–AI collaboration|I am interested in making language models work/,
  'plain about copy should not keep stale hard-coded intro text',
);

assert.match(
  terminalJs,
  /function renderPlainAbout\(\)[\s\S]*content\.me\.content/,
  'terminal.js should render the plain about section from data/me.json',
);

assert.match(
  terminalJs,
  /function renderPlainView\(\)[\s\S]*renderPlainAbout\(\)/,
  'plain view rendering should include the about renderer',
);

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
