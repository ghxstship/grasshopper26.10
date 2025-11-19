#!/usr/bin/env python3
"""
Add errors to @/lib/api/response import if file uses errors.rateLimitExceeded()
"""

import os
import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file uses errors but doesn't import it
    uses_errors = 'errors.rateLimitExceeded()' in content or 'errors.notFound(' in content or 'errors.conflict(' in content
    has_response_import = "from '@/lib/api/response'" in content
    has_errors_in_response = has_response_import and ', errors' in content and "from '@/lib/api/response'" in content
    
    if uses_errors and has_response_import and not has_errors_in_response:
        # Add errors to the response import - handle trailing comma/space
        content = re.sub(
            r"(import \{[^}]*?)(\s*} from '@/lib/api/response')",
            lambda m: m.group(1).rstrip(', ') + ', errors' + m.group(2),
            content
        )
        
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
    print("🔧 Adding missing errors imports...\n")
    main()
