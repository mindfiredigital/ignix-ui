#!/bin/bash

# Get latest commit message
COMMIT_MSG=$(git log -1 --pretty=%B)
echo "📝 Commit message: $COMMIT_MSG"

# Define valid scopes
VALID_SCOPES=("cli" "docs" "release" "registry" "storybook" "component")

# Check for scope match j
for scope in "${VALID_SCOPES[@]}"; do
  if [[ "$COMMIT_MSG" == *"$scope"* ]]; then
    echo "✅ Scope '$scope' found in commit message."
    echo "scope=true" >> $GITHUB_OUTPUT
    exit 0
  fi
done

echo "⚠️ No valid scope found. Skipping scoped jobs"
echo "scope=false" >> $GITHUB_OUTPUT
exit 0