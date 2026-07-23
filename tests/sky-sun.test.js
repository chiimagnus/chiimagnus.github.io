const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const cel = { className: '', style: {} };
const context = {
  Date,
  Math,
  URLSearchParams,
  location: { search: '' },
  document: {
    documentElement: { style: { setProperty() {} } },
    getElementById(id) { return id === 'cel' ? cel : null; },
  },
  window: { innerWidth: 1024 },
};

vm.runInNewContext(fs.readFileSync('src/js/sky.js', 'utf8'), context);

for (const [hour, expected] of [
  [5, 'cel sun sun-morning'],
  [9.99, 'cel sun sun-morning'],
  [10, 'cel sun sun-noon'],
  [16.99, 'cel sun sun-noon'],
  [17, 'cel sun sun-evening'],
  [18.99, 'cel sun sun-evening'],
  [19, 'cel moon'],
  [4.99, 'cel moon'],
]) {
  context.window.SkyDebug.setHour(hour);
  assert.equal(cel.className, expected, `unexpected celestial body at ${hour}:00`);
}

const css = fs.readFileSync('src/base.css', 'utf8');
for (const name of ['morning', 'noon', 'evening']) {
  assert.match(css, new RegExp(`sun-${name}\\.png`));
  assert.ok(fs.existsSync(`public/sun-${name}.png`));
}
