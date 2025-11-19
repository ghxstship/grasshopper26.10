#!/usr/bin/env python3
"""
Fix double comma syntax errors in imports
"""

import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix patterns like ", , errors" or ",  , errors"
    content = re.sub(r',\s*,\s*errors', ', errors', content)
    
    # Fix patterns like "requireAuth,  }" 
    content = re.sub(r',\s+\}', ' }', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Walk through all API route files and fix them"""
    api_dir = Path(__file__).parent.parent / 'src' / 'app' / 'api'
    
    fixed_count = 0
    for route_file in api_dir.rglob('route.ts'):
        if fix_file(route_file):
            print(f"✓ Fixed: {route_file.relative_to(Path.cwd())}")
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files")

if __name__ == '__main__':
    print("🔧 Fixing double comma syntax errors...\n")
    main()
