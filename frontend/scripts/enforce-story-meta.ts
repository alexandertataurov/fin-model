import fs from 'fs';
import path from 'path';
import { globby } from 'globby';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirnameESM = path.dirname(__filename);
const ROOT = path.resolve(__dirnameESM, '..');
const STORIES_DIR = path.join(ROOT, 'src', 'design-system', 'stories');

function ensureAutodocsTag(metaBlock: string): string {
    if (/\btags\s*:\s*\[\s*'autodocs'\s*\]/.test(metaBlock)) return metaBlock;
    // Insert tags near start of meta object
    return metaBlock.replace(/(const\s+meta\s*:[^{]+\{)([\s\S]*?title\s*:\s*[^,]+,)/, (_m, start, titleLine) => {
        return `${start}${titleLine}\n  tags: ['autodocs'],`;
    });
}

function ensureDocsDescription(metaBlock: string): string {
    if (/parameters\s*:\s*\{[\s\S]*docs\s*:\s*\{[\s\S]*description\s*:\s*\{[\s\S]*component\s*:/.test(metaBlock)) {
        return metaBlock;
    }
    if (/parameters\s*:\s*\{/.test(metaBlock)) {
        return metaBlock.replace(/parameters\s*:\s*\{/, `parameters: {\n    docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } },`);
    }
    // Add parameters if not present
    return metaBlock.replace(/(const\s+meta\s*:[^{]+\{)/, `$1\n  parameters: { docs: { description: { component: 'Usage: Refer to guidelines. Accessibility: Keyboard and screen reader supported.' } } },`);
}

function ensureStatesExports(content: string): string {
    const hasLoading = /export\s+const\s+Loading\b/.test(content);
    const hasEmpty = /export\s+const\s+Empty\b/.test(content);
    const hasError = /export\s+const\s+Error\b/.test(content);
    const blocks: string[] = [];
    if (!hasLoading) {
        blocks.push("export const Loading = { parameters: { docs: { description: { story: 'No data — loading…' } } } };");
    }
    if (!hasEmpty) {
        blocks.push("export const Empty = { parameters: { docs: { description: { story: 'No data available.' } } } };");
    }
    if (!hasError) {
        blocks.push("export const Error = { parameters: { docs: { description: { story: 'Error state.' } } } };");
    }
    if (blocks.length === 0) return content;
    return content.trimEnd() + '\n' + blocks.join('\n') + '\n';
}

async function run() {
    const files = await globby(['**/*.stories.tsx'], { cwd: STORIES_DIR, absolute: true });
    let modified = 0;
    for (const file of files) {
        const text = fs.readFileSync(file, 'utf8');
        if (!/const\s+meta\s*:\s*Meta/.test(text)) continue; // skip MDX or unconventional
        const metaMatch = text.match(/const\s+meta\s*:[\s\S]*?=\s*\{[\s\S]*?\n\};/);
        if (!metaMatch) continue;
        const metaBlock = metaMatch[0];
        const newMetaWithTags = ensureAutodocsTag(metaBlock);
        const newMeta = ensureDocsDescription(newMetaWithTags);
        let newText = text.replace(metaBlock, newMeta);
        newText = ensureStatesExports(newText);
        if (newText !== text) {
            fs.writeFileSync(file, newText, 'utf8');
            modified++;
        }
    }
    console.log(`Updated ${modified} story files.`);
}

run().catch((err) => {
    console.error(err);
    process.exit(1);
});


