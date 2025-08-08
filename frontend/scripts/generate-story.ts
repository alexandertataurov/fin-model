#!/usr/bin/env ts-node
import fs from 'fs';
import path from 'path';

const target = process.argv[2];
if (!target) {
  console.error('Usage: pnpm gen:story src/path/Component.tsx');
  process.exit(1);
}

const full = path.resolve(process.cwd(), target);
if (!fs.existsSync(full)) {
  console.error('Component not found:', full);
  process.exit(1);
}

const dir = path.dirname(full);
const extless = path.basename(full).replace(/\.(tsx|ts)$/, '');
const storyPath = path.join(dir, `${extless}.stories.tsx`);
if (fs.existsSync(storyPath)) {
  console.log('Story already exists:', storyPath);
  process.exit(0);
}

const importPath = `./${extless}`;
const titleSeg = dir.includes('design-system')
  ? 'Design System'
  : dir.includes('pages')
  ? 'Pages'
  : 'Components';
const story = `import type { Meta, StoryObj } from '@storybook/react';
import { ${extless} } from '${importPath}';

const meta: Meta<typeof ${extless}> = {
  title: '${titleSeg}/${extless}',
  component: ${extless},
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: {} };
export const Loading: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Empty: Story = { parameters: { docs: { description: { story: 'No data state.' } } } };
export const Error: Story = { parameters: { docs: { description: { story: 'Error state.' } } } };
`;

fs.writeFileSync(storyPath, story);
console.log('Created', storyPath);
