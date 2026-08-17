// packages/cli-tool/src/utils/agentsFile.ts
import path from 'path';
import fs from 'fs-extra';

const MARKER = '<!-- ignix-cli-guide -->';

const IGNIX_SECTION = `${MARKER}
## Ignix UI

This project is managed with the Ignix UI CLI (\`ignix\`). When working with Ignix
components, themes, or templates:

- Discover what's available: \`ignix list component --json\`, \`ignix list theme --json\`,
  \`ignix list template --json\` (add \`--search <query>\` to filter)
- Full command reference: run \`ignix llms\` for the complete, always-up-to-date guide
  (commands, flags, conventions, do's/don'ts)
- Install: \`ignix add component <name...> --yes --json\` (accepts multiple names in one call)
- Check project compatibility: \`ignix doctor --json\`
- Installing a theme is not enough on its own - it must be wired into \`<ThemeProvider>\`'s
  \`defaultTheme\` prop to have any visual effect. Run \`ignix llms\` for the exact steps.

Do NOT:
- Fetch \`registryUrl\`/\`themeUrl\` from \`ignix.config.js\` directly - always go through the
  \`ignix\` CLI instead of reading or fetching them yourself
- Read component documentation from \`node_modules\` - installed component source lives in
  \`src/components/ui/<name>/\`, and the full component/theme/template catalog is only
  accurate via \`ignix list ... --json\`
`;

/**
 * Writes or merges the Ignix guide section into a single guide file. If the file already
 * exists (e.g. the developer has their own agent instructions), the section is appended
 * rather than overwriting it. Safe to call repeatedly - won't duplicate the section if
 * it's already present (checked via MARKER).
 */
async function writeOrMergeGuide(filePath: string, title: string): Promise<void> {
  if (!(await fs.pathExists(filePath))) {
    await fs.writeFile(filePath, `# ${title}\n\n${IGNIX_SECTION}`);
    return;
  }

  const existing = await fs.readFile(filePath, 'utf-8');
  if (existing.includes(MARKER)) {
    return;
  }

  await fs.writeFile(filePath, `${existing.trimEnd()}\n\n${IGNIX_SECTION}`);
}

/**
 * Ensures both AGENTS.md and CLAUDE.md exist and contain the Ignix usage guide.
 * AGENTS.md covers the cross-tool convention (Codex, etc.); CLAUDE.md is written
 * separately because it's the file Claude Code specifically force-loads into every
 * session's context automatically - AGENTS.md alone isn't guaranteed to be read.
 */
export async function writeAgentsFile(root: string): Promise<void> {
  await writeOrMergeGuide(path.join(root, 'AGENTS.md'), 'AGENTS.md');
  await writeOrMergeGuide(path.join(root, 'CLAUDE.md'), 'CLAUDE.md');
}
