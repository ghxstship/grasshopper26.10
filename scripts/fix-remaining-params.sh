#!/bin/bash

# List of files that need params.id fixes
files=(
  "src/app/api/atlvs/documents/[id]/route.ts"
  "src/app/api/atlvs/documents/[id]/versions/route.ts"
  "src/app/api/atlvs/equipment/[id]/maintenance/route.ts"
  "src/app/api/atlvs/projects/[id]/phases/route.ts"
  "src/app/api/atlvs/tasks/[id]/assign/route.ts"
  "src/app/api/atlvs/workflows/[id]/execute/route.ts"
  "src/app/api/compvss/expenses/[id]/reject/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    # This is a placeholder - we'll use the edit tool instead
  fi
done
