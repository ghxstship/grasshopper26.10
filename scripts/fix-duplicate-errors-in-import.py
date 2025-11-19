#!/usr/bin/env python3
"""
Fix duplicate errors in the same import statement
"""

import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Fix patterns like "errors , errors" or "errors , handleApiError , errors"
    # Replace with just the unique items
    def fix_import(match):
        full_import = match.group(0)
        # Extract all items between braces
        items_match = re.search(r'\{([^}]+)\}', full_import)
        if items_match:
            items_str = items_match.group(1)
            # Split by comma, strip whitespace, and deduplicate
            items = [item.strip() for item in items_str.split(',') if item.strip()]
            unique_items = []
            seen = set()
            for item in items:
                if item not in seen:
                    unique_items.append(item)
                    seen.add(item)
            # Rebuild the import
            new_items = ', '.join(unique_items)
            return full_import.replace(items_str, f' {new_items} ')
        return full_import
    
    content = re.sub(
        r"import \{[^}]+\} from ['\"]@/lib/api/response['\"];",
        fix_import,
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
    print("🔧 Fixing duplicate errors in same import...\n")
    main()
