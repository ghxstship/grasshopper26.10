#!/usr/bin/env python3
import re
import sys
from pathlib import Path

def fix_imports_in_file(filepath):
    """Fix missing imports in a TypeScript/TSX file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original_content = content
    modified = False
    
    # Check if file uses React hooks but doesn't import them
    react_hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef']
    lucide_icons = ['AlertCircle', 'Loader2']
    
    # Find existing React import
    react_import_match = re.search(r"import\s+{([^}]+)}\s+from\s+['\"]react['\"]", content)
    
    if react_import_match:
        existing_imports = set(i.strip() for i in react_import_match.group(1).split(','))
        needed_imports = set()
        
        for hook in react_hooks:
            # Check if hook is used but not imported
            if re.search(rf'\b{hook}\s*\(', content) and hook not in existing_imports:
                needed_imports.add(hook)
        
        if needed_imports:
            all_imports = sorted(existing_imports | needed_imports)
            new_import = f"import {{ {', '.join(all_imports)} }} from 'react'"
            content = content.replace(react_import_match.group(0), new_import)
            modified = True
    
    # Find existing lucide-react import
    lucide_import_match = re.search(r"import\s+{([^}]+)}\s+from\s+['\"]lucide-react['\"]", content)
    
    if lucide_import_match:
        existing_imports = set(i.strip() for i in lucide_import_match.group(1).split(','))
        needed_imports = set()
        
        for icon in lucide_icons:
            # Check if icon is used but not imported
            if f'<{icon}' in content and icon not in existing_imports:
                needed_imports.add(icon)
        
        if needed_imports:
            all_imports = sorted(existing_imports | needed_imports)
            new_import = f"import {{ {', '.join(all_imports)} }} from 'lucide-react'"
            content = content.replace(lucide_import_match.group(0), new_import)
            modified = True
    
    if modified and content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

if __name__ == '__main__':
    files_to_fix = [
        'src/app/compvss/issues/routing/page.tsx',
        'src/app/compvss/operations/check-in/page.tsx',
        'src/app/compvss/operations/tasks/page.tsx',
        'src/app/compvss/settings/account/page.tsx',
        'src/app/compvss/team/directory/page.tsx',
        'src/app/compvss/team/members/page.tsx',
        'src/app/gvteway/adventures/page.tsx',
        'src/app/gvteway/auth/verify-email/page.tsx',
        'src/app/gvteway/events/calendar/page.tsx',
        'src/app/gvteway/events/category/[slug]/page.tsx',
        'src/app/gvteway/marketplace/page.tsx',
        'src/app/gvteway/settings/account/page.tsx',
        'src/app/gvteway/settings/page.tsx',
        'src/app/gvteway/social/page.tsx',
        'src/app/gvteway/tickets/page.tsx',
        'src/app/gvteway/wallet/nft/page.tsx',
        'src/app/gvteway/wallet/page.tsx',
        'src/components/atlvs/DataTable.tsx',
        'src/hooks/useABTest.tsx',
    ]
    
    base_path = Path('/Users/julianclarkson/Documents/Grasshopper26.10')
    fixed_count = 0
    
    for file_path in files_to_fix:
        full_path = base_path / file_path
        if full_path.exists():
            if fix_imports_in_file(full_path):
                print(f"Fixed: {file_path}")
                fixed_count += 1
        else:
            print(f"Not found: {file_path}")
    
    print(f"\nFixed {fixed_count} files")
