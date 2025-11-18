#!/usr/bin/env python3
import re
import subprocess
from pathlib import Path

def get_files_with_missing_icons():
    """Get list of files with missing AlertCircle or Loader2"""
    result = subprocess.run(
        ['npx', 'tsc', '--noEmit'],
        capture_output=True,
        text=True,
        cwd='/Users/julianclarkson/Documents/Grasshopper26.10'
    )
    
    files = set()
    for line in result.stderr.split('\n'):
        if "Cannot find name 'AlertCircle'" in line or "Cannot find name 'Loader2'" in line:
            match = re.match(r'([^(]+)\(', line)
            if match:
                files.add(match.group(1))
    
    return sorted(files)

def fix_lucide_imports(filepath):
    """Add missing AlertCircle and Loader2 to lucide-react imports"""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except:
        return False
    
    original_content = content
    
    # Find existing lucide-react import
    lucide_pattern = r"import\s+{\s*([^}]+?)\s*}\s+from\s+['\"]lucide-react['\"]"
    match = re.search(lucide_pattern, content)
    
    if not match:
        return False
    
    existing_imports = [i.strip() for i in match.group(1).split(',')]
    existing_set = set(existing_imports)
    needed = set()
    
    # Check what's needed
    if '<AlertCircle' in content and 'AlertCircle' not in existing_set:
        needed.add('AlertCircle')
    if '<Loader2' in content and 'Loader2' not in existing_set:
        needed.add('Loader2')
    
    if not needed:
        return False
    
    # Add needed imports
    all_imports = existing_imports + sorted(needed)
    new_import = f"import {{ {', '.join(all_imports)} }} from 'lucide-react'"
    content = re.sub(lucide_pattern, new_import, content)
    
    if content != original_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

if __name__ == '__main__':
    base_path = Path('/Users/julianclarkson/Documents/Grasshopper26.10')
    
    print("Finding files with missing Lucide icons...")
    files = get_files_with_missing_icons()
    
    print(f"Found {len(files)} files to fix\n")
    
    fixed_count = 0
    for file_rel in files:
        file_path = base_path / file_rel
        if file_path.exists():
            if fix_lucide_imports(file_path):
                print(f"✓ {file_rel}")
                fixed_count += 1
        else:
            print(f"✗ Not found: {file_rel}")
    
    print(f"\nFixed {fixed_count} files")
