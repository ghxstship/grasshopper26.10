#!/usr/bin/env python3
"""
Aggressive gradient removal script
Removes ALL from-/via-/to- color classes from TSX files
"""

import re
import os
import glob

def remove_gradients_from_file(filepath):
    """Remove all gradient-related classes from a file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Pattern 1: Remove from-/via-/to- color classes in className strings
    # Matches: from-color-number, via-color-number, to-color-number
    content = re.sub(r'\s+from-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+via-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+to-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+from-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+via-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+to-[a-z]+-[0-9]+', '', content)
    
    # Pattern 2: Remove from template literals
    content = re.sub(r'\s+from-transparent', '', content)
    content = re.sub(r'\s+to-transparent', '', content)
    content = re.sub(r'\s+via-transparent', '', content)
    
    # Pattern 3: Remove hover: variants
    content = re.sub(r'\s+hover:from-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+hover:via-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+hover:to-[a-z]+-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+hover:from-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+hover:via-[a-z]+-[0-9]+', '', content)
    content = re.sub(r'\s+hover:to-[a-z]+-[0-9]+', '', content)
    
    # Pattern 4: Clean up double spaces
    content = re.sub(r'  +', ' ', content)
    content = re.sub(r' "', '"', content)
    content = re.sub(r' `', '`', content)
    content = re.sub(r' }', '}', content)
    
    # Write back if changed
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    print("🔍 Finding all TSX files in src/app...")
    files = glob.glob('src/app/**/*.tsx', recursive=True)
    
    print(f"📝 Found {len(files)} TSX files")
    print()
    
    modified_count = 0
    
    for i, filepath in enumerate(files, 1):
        if remove_gradients_from_file(filepath):
            print(f"[{i}/{len(files)}] ✅ {filepath}")
            modified_count += 1
        else:
            # Only show first 20 unmodified
            if i <= 20:
                print(f"[{i}/{len(files)}] ⏭️  {filepath}")
    
    print()
    print(f"✨ Complete! Modified {modified_count} files")
    print()
    
    # Verification
    print("🔍 Verifying...")
    remaining = 0
    for filepath in files:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            # Check for gradient patterns (excluding transform/translate)
            if re.search(r'\s(?:from|via|to)-(?!start|end)[a-z]+-', content):
                if 'transform' not in content and 'translate' not in content:
                    remaining += 1
    
    print(f"Files with remaining gradient classes: {remaining}")
    
    if remaining == 0:
        print("✅ 100% gradient removal achieved!")
    else:
        print(f"⚠️  {remaining} files need manual review")

if __name__ == '__main__':
    main()
