#!/usr/bin/env python3
"""
Fix all service method calls to use correct signatures
- findById(id) not findById({ where: { id } })
- update(id, data) not update({ where: { id }, data })
- delete(id) not delete({ where: { id } })
"""

import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix findById with where clause - single line
    content = re.sub(
        r'\.findById\(\{\s*where:\s*\{\s*(\w+)\s*\}\s*\}\)',
        r'.findById(\1)',
        content
    )
    
    # Fix findById with where clause - multi-line (simple cases)
    content = re.sub(
        r'\.findById\(\{\s*where:\s*\{\s*(\w+):\s*(\w+)\s*\}\s*\}\)',
        r'.findById(\2)',
        content
    )
    
    # Fix update with where and data - single line
    content = re.sub(
        r'\.update\(\{\s*where:\s*\{\s*(\w+)\s*\},\s*data:\s*(\w+)\s*\}\)',
        r'.update(\1, \2)',
        content
    )
    
    # Fix update with where and data - multi-line
    content = re.sub(
        r'\.update\(\{\s*where:\s*\{\s*(\w+):\s*(\w+)\s*\},\s*data:\s*(\w+)\s*\}\)',
        r'.update(\2, \3)',
        content
    )
    
    # Fix delete with where clause - single line
    content = re.sub(
        r'\.delete\(\{\s*where:\s*\{\s*(\w+)\s*\}\s*\}\)',
        r'.delete(\1)',
        content
    )
    
    # Fix delete with where clause - multi-line
    content = re.sub(
        r'\.delete\(\{\s*where:\s*\{\s*(\w+):\s*(\w+)\s*\}\s*\}\)',
        r'.delete(\2)',
        content
    )
    
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
    print("🔧 Fixing all service method calls...\n")
    main()
