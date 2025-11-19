#!/usr/bin/env python3
"""
Remove duplicate errors imports
Keep the one from @/lib/api/response, remove the one from @/lib/api/errors
"""

import os
import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    changed = False
    
    # Check if both imports exist
    has_response_import = "from '@/lib/api/response'" in content
    has_errors_from_errors = 'import { errors } from "@/lib/api/errors";' in content or "import { errors } from '@/lib/api/errors';" in content
    has_errors_from_response = ', errors' in content and has_response_import
    
    if has_errors_from_response and has_errors_from_errors:
        # Remove the duplicate import from @/lib/api/errors (both quote styles)
        content = re.sub(r'import \{ errors \} from ["\']@/lib/api/errors["\'];\n', "", content)
        changed = True
    
    # Also check if errors is in response import but not needed
    if has_errors_from_errors and not has_errors_from_response:
        # Add errors to response import if handleApiError is there
        if 'handleApiError' in content and has_response_import:
            content = re.sub(
                r"(import \{[^}]*handleApiError[^}]*)(\s*} from ['\"]@/lib/api/response['\"])",
                lambda m: m.group(1).rstrip(', ') + ', errors' + m.group(2) if ', errors' not in m.group(1) else m.group(0),
                content
            )
            # Now remove the errors-only import
            content = re.sub(r'import \{ errors \} from ["\']@/lib/api/errors["\'];\n', "", content)
            changed = True
    
    if changed:
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
    print("🔧 Removing duplicate errors imports...\n")
    main()
