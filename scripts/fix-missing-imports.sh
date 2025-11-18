#!/bin/bash

# Fix missing React imports (useMemo, useState, useEffect, useCallback)
find src/app -name "*.tsx" -type f -exec grep -l "useMemo\|useState\|useEffect\|useCallback" {} \; | while read file; do
  # Check if React import exists
  if grep -q "from 'react'" "$file"; then
    # Add missing hooks to existing import
    if grep -q "useMemo" "$file" && ! grep -q "useMemo.*from 'react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'react'/import { \1, useMemo } from 'react'/" "$file"
    fi
    if grep -q "useState" "$file" && ! grep -q "useState.*from 'react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'react'/import { \1, useState } from 'react'/" "$file"
    fi
    if grep -q "useEffect" "$file" && ! grep -q "useEffect.*from 'react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'react'/import { \1, useEffect } from 'react'/" "$file"
    fi
    if grep -q "useCallback" "$file" && ! grep -q "useCallback.*from 'react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'react'/import { \1, useCallback } from 'react'/" "$file"
    fi
  fi
done

# Fix missing lucide-react imports (AlertCircle, Loader2)
find src/app -name "*.tsx" -type f -exec grep -l "<AlertCircle\|<Loader2" {} \; | while read file; do
  if grep -q "from 'lucide-react'" "$file"; then
    if grep -q "<AlertCircle" "$file" && ! grep -q "AlertCircle.*from 'lucide-react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'lucide-react'/import { \1, AlertCircle } from 'lucide-react'/" "$file"
    fi
    if grep -q "<Loader2" "$file" && ! grep -q "Loader2.*from 'lucide-react'" "$file"; then
      sed -i '' "s/import { \(.*\) } from 'lucide-react'/import { \1, Loader2 } from 'lucide-react'/" "$file"
    fi
  fi
done

echo "Import fixes applied"
