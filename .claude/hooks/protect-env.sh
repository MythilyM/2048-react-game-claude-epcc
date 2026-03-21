#!/bin/bash
# Read the JSON event data from stdin
# Run the below command to make this shell script executable to block reads of sensitive files by claude
# chmod +x .claude/hooks/protect-env.sh


INPUT=$(cat)

# Extract the file path (Read uses file_path, Grep uses path)
FILE_PATH=$(echo "$INPUT" | jq -r '.tool_input.file_path // .tool_input.path // empty')

# Block access to .env files
if echo "$FILE_PATH" | grep -q '\.env'; then
  echo "Security policy: Cannot read .env file — contains sensitive configuration" >&2
  exit 2
fi

# Allow all other file reads
exit 0