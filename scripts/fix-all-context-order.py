#!/usr/bin/env python3
"""
Fix context declaration order in all API route files
Moves context declaration before rate limiting checks
"""

import os
import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    changed = False
    
    # Add errors import if missing
    if 'errors.rateLimitExceeded()' in content and "from '@/lib/api/errors'" not in content:
        # Find last import
        imports = list(re.finditer(r'import\s+.*?from\s+[\'"].*?[\'"];?\n', content))
        if imports:
            last_import = imports[-1]
            insert_pos = last_import.end()
            content = content[:insert_pos] + "import { errors } from '@/lib/api/errors';\n" + content[insert_pos:]
            changed = True
    
    # Fix context order - find all async function exports
    # Pattern: function with rate limit using context before context is declared
    pattern = r'(export async function \w+\([^)]*\)\s*\{\s*try\s*\{\s*)(\/\/ Rate limiting\s+if\s*\(\s*!rateLimit\(\s*RateLimitIdentifiers\.byUserId\(context\.userId\),[\s\S]*?\}\s*\}\s*\n\s*)(const context = await validateRequest\(request\);[\s\S]*?requireAuth\(context\);)'
    
    def reorder_match(match):
        nonlocal changed
        changed = True
        fn_start = match.group(1)
        rate_limit_block = match.group(2)
        context_declaration = match.group(3)
        
        # Return with context first, then rate limiting
        return f"{fn_start}{context_declaration}\n\n    {rate_limit_block}"
    
    content = re.sub(pattern, reorder_match, content)
    
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
    print("🔧 Fixing context declaration order in API routes...\n")
    main()
