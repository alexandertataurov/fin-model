#!/usr/bin/env node
const { globby } = require('globby');

(async () => {
  const componentGlobs = [
    'src/components/**/*.{tsx,ts}',
    'src/design-system/components/**/*.{tsx,ts}',
    'src/pages/**/*.{tsx,ts}',
  ];
  const storyGlobs = ['src/**/*.{stories.tsx,stories.ts}'];

  const components = (await globby(componentGlobs)).filter(
    p => !p.endsWith('.stories.tsx')
  );
  const stories = await globby(storyGlobs);

  const toBase = p => p.replace(/\.(tsx|ts)$/, '').replace(/\\/g, '/');
  const hasStory = new Set(
    stories.map(s => toBase(s).replace(/\.stories$/, ''))
  );

  const missing = [];
  for (const c of components) {
    const base = toBase(c);
    const candidates = [
      `${base}.stories`,
      base.replace('/components/', '/stories/'),
    ];
    if (!candidates.some(x => hasStory.has(x))) {
      missing.push(c);
    }
  }

  if (missing.length) {
    console.error(`Missing stories for ${missing.length} files:`);
    for (const m of missing) console.error(` - ${m}`);
    process.exit(1);
  }
  console.log('All components have stories.');
})();
