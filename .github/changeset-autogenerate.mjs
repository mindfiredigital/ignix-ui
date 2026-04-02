import { execSync } from 'child_process';
import fs from 'fs';

// 🚨 Prevent duplicate changesets
if (fs.existsSync('.changeset')) {
  const existing = fs.readdirSync('.changeset').filter(f => f.endsWith('.md'));
  if (existing.length > 0) {
    console.log('⚠️ Changeset already exists, skipping generation');
    process.exit(0);
  }
}

// Get latest commit message
const commitMessage = execSync('git log -1 --format=%s').toString().trim();

console.log(`📝 Processing commit message: "${commitMessage}"`);

// Valid scopes for release
const validScopes = ['cli', 'ui'];

// Regex patterns (with ! support)
const commitPatterns = {
  minor: /^feat\(([^)]+)\)!?: (.+)/,
  patch: /^fix\(([^)]+)\)!?: (.+)/,
};

// Detect breaking change
const isBreaking =
  /!:/.test(commitMessage) || commitMessage.includes('BREAKING CHANGE');

// Identify type, package, and description
let packageScope = null;
let changeType = null;
let description = null;

// 🔴 MAJOR
if (isBreaking) {
  const match =
    commitMessage.match(/^feat\(([^)]+)\)!?: (.+)/) ||
    commitMessage.match(/^fix\(([^)]+)\)!?: (.+)/);

  if (match && validScopes.includes(match[1])) {
    changeType = 'major';
    packageScope = match[1];
    description = match[2];
  }
}

// 🟡 MINOR
else if (commitPatterns.minor.test(commitMessage)) {
  const match = commitMessage.match(commitPatterns.minor);
  if (validScopes.includes(match[1])) {
    changeType = 'minor';
    packageScope = match[1];
    description = match[2];
  }
}

// 🟢 PATCH
else if (commitPatterns.patch.test(commitMessage)) {
  const match = commitMessage.match(commitPatterns.patch);
  if (validScopes.includes(match[1])) {
    changeType = 'patch';
    packageScope = match[1];
    description = match[2];
  }
}

// Generate changeset
if (packageScope) {
  packageScope = packageScope.trim();
  description = description?.trim() || 'No description provided.';

  // ✅ Correct package mapping
  const packageName =
    packageScope === 'cli'
      ? '@mindfiredigital/ignix-cli'
      : packageScope === 'ui'
      ? '@mindfiredigital/ignix-ui'
      : null;

  if (!packageName) {
    console.log('⚠️ Invalid package mapping');
    process.exit(0);
  }

  const changesetContent = `---
'${packageName}': ${changeType}
---
${description}
`;

  fs.writeFileSync(`.changeset/auto-${Date.now()}.md`, changesetContent);

  console.log(
    `✅ Changeset created → ${packageName} (${changeType})`
  );
} else {
  console.log(
    '⚠️ No valid commit found. Use: feat(scope), fix(scope), or ! for breaking'
  );
}
