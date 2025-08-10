#!/usr/bin/env node
const { globby } = require('globby');

(async () => {
  const componentGlobs = [
    'src/components/**/*.{tsx,ts}',
    'src/design-system/components/**/*.{tsx,ts}',
    'src/pages/**/*.{tsx,ts}',
  ];
  const storyGlobs = ['src/**/*.{stories.tsx,stories.ts,stories.mdx}'];

  const allComponents = (await globby(componentGlobs)).filter(
    p => !p.endsWith('.stories.tsx') && !p.endsWith('.stories.ts') && !p.endsWith('.stories.mdx')
  );
  const ignore = [
    /\/index\.(tsx|ts)$/,
    /\/pages\//,
    /dashboardConstants\.(ts|tsx)$/,
    /theme-hooks\.(ts|tsx)$/,
    /use-[^/]+\.(ts|tsx)$/,
    /\/design-system\/components\/(Chart|DesignSystemProvider|ThemeProvider|Toaster)\.tsx$/,
    /\/components\/(layout|dashboard-layout)\.tsx$/,
    /\/components\/Layout\/(Layout|Sidebar)\.tsx$/,
    /\/components\/draggable-widget\.tsx$/,
    /\/components\/CoreFinancialModeling\/shared\.tsx$/,
    /\/__tests__\//,
    /\.test\.(ts|tsx)$/,
    /\.spec\.(ts|tsx)$/,
    /\.stories\.(ts|tsx|mdx)$/,
    /\.mdx$/,
  ];
  const components = allComponents.filter(
    p => !ignore.some(re => re.test(p.replace(/\\/g, '/')))
  );
  const stories = await globby(storyGlobs);

  const toBase = p => p.replace(/\.(tsx|ts|mdx)$/, '').replace(/\\/g, '/');
  const hasStory = new Set(
    stories.map(s => toBase(s).replace(/\.stories$/, ''))
  );

  const missing = [];
  for (const c of components) {
    const base = toBase(c);
    const candidates = [base, base.replace('/components/', '/stories/')];
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
