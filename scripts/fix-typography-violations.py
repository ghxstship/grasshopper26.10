#!/usr/bin/env python3
"""
Fix Typography Violations
Replace raw font/text classes with Typography components
"""

import os
import re
from pathlib import Path

def fix_typography_violations(file_path):
    """Replace raw font and text size classes"""
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Remove raw font classes (font-bebas, font-anton, etc.)
    content = re.sub(r'\s+font-bebas', '', content)
    content = re.sub(r'\s+font-anton', '', content)
    content = re.sub(r'\s+font-oswald', '', content)
    content = re.sub(r'\s+font-share-tech-mono', '', content)
    content = re.sub(r'\s+font-share-tech', '', content)
    
    # Remove raw text size classes (text-h1, text-h2, etc.)
    content = re.sub(r'\s+text-h1', '', content)
    content = re.sub(r'\s+text-h2', '', content)
    content = re.sub(r'\s+text-h3', '', content)
    content = re.sub(r'\s+text-h4', '', content)
    content = re.sub(r'\s+text-h5', '', content)
    content = re.sub(r'\s+text-h6', '', content)
    content = re.sub(r'\s+text-hero', '', content)
    content = re.sub(r'\s+text-display', '', content)
    content = re.sub(r'\s+text-subtitle', '', content)
    content = re.sub(r'\s+text-body-lg', '', content)
    content = re.sub(r'\s+text-body-sm', '', content)
    content = re.sub(r'\s+text-body(?!\-)', '', content)
    content = re.sub(r'\s+text-caption', '', content)
    content = re.sub(r'\s+text-overline', '', content)
    content = re.sub(r'\s+text-meta', '', content)
    
    if content != original:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        return 1
    return 0

def main():
    print("🔧 Fixing Typography Violations...")
    print("Removing raw font and text size classes\n")
    
    src_dir = Path('src/app')
    files_fixed = 0
    
    for tsx_file in src_dir.rglob('*.tsx'):
        if fix_typography_violations(tsx_file):
            files_fixed += 1
            print(f"✓ {tsx_file}")
    
    print(f"\n✅ Fixed {files_fixed} files")
    print("Typography components should now be used instead of raw classes\n")

if __name__ == '__main__':
    main()
