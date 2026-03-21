#!/bin/bash
# Read the JSON event data from stdin
# Run the below command to make this shell script executable to typecheck as a posthook
# chmod +x .claude/hooks/typecheck.sh

INPUT=$(cat)

# Extract the file path that was just modified
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // empty')

# Only run type-checking for TypeScript files
if [[ ! "$FILE_PATH" =~ \.(ts|tsx)$ ]]; then
  exit 0
fi

# Run TypeScript type checker
OUTPUT=$(npx tsc --noEmit 2>&1)
EXIT_CODE=$?

# If type errors exist, report them to Claude via stderr
if [ $EXIT_CODE -ne 0 ]; then
  ERROR_COUNT=$(echo "$OUTPUT" | grep -c "error TS")
  echo "TypeScript type check found $ERROR_COUNT error(s) after editing $FILE_PATH:" >&2
  echo "$OUTPUT" >&2
  echo "" >&2
  echo "Please fix these type errors in the affected files." >&2
fi

# Always exit 0 — report errors as feedback, don't block the edit
exit 0