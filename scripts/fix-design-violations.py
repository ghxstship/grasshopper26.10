#!/usr/bin/env python3
"""
Atomic Design System Violation Fix Script
Systematically fixes common design system violations across the codebase
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

# Color mapping for semantic tokens
COLOR_MAP = {
    'text-gray-300': 'text-ghxst-text-secondary',
    'text-gray-400': 'text-ghxst-text-secondary',
    'text-gray-500': 'text-ghxst-text-secondary',
    'text-gray-600': 'text-ghxst-text-secondary',
    'text-gray-700': 'text-ghxst-text-primary',
    'text-gray-800': 'text-ghxst-text-primary',
    'text-gray-900': 'text-ghxst-text-primary',
    'text-white': 'text-ghxst-text-inverse',
    'text-black': 'text-ghxst-text-primary',
}

def count_violations(directory: str) -> Tuple[int, int]:
    """Count text-gray and bg-gray violations"""
    text_count = 0
    bg_count = 0
    
    for tsx_file in Path(directory).rglob('*.tsx'):
        try:
            content = tsx_file.read_text()
            text_count += len(re.findall(r'className="[^"]*text-gray-\d+', content))
            bg_count += len(re.findall(r'className="[^"]*bg-gray-\d+', content))
        except Exception as e:
            print(f"Error reading {tsx_file}: {e}")
    
    return text_count, bg_count

def fix_text_colors(file_path: Path) -> int:
    """Replace text-gray-* with semantic tokens"""
    try:
        content = file_path.read_text()
        original = content
        
        for old_class, new_class in COLOR_MAP.items():
            content = content.replace(old_class, new_class)
        
        if content != original:
            file_path.write_text(content)
            return 1
        return 0
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return 0

def fix_bg_colors(file_path: Path) -> int:
    """Remove bg-gray-* overrides from className"""
    try:
        content = file_path.read_text()
        original = content
        
        # Remove bg-gray-* with opacity (e.g., bg-gray-900/50)
        content = re.sub(r'bg-gray-\d+/\d+\s*', '', content)
        # Remove plain bg-gray-*
        content = re.sub(r'bg-gray-\d+\s*', '', content)
        
        if content != original:
            file_path.write_text(content)
            return 1
        return 0
    except Exception as e:
        print(f"Error fixing {file_path}: {e}")
        return 0

def main():
    print("🔍 Starting Atomic Design System Violation Fixes...")
    print()
    
    src_dir = 'src/app'
    
    # Count violations before
    print("📊 Counting violations before fixes...")
    before_text, before_bg = count_violations(src_dir)
    print(f"  - text-gray violations: {before_text}")
    print(f"  - bg-gray violations: {before_bg}")
    print()
    
    # Fix violations
    print("🔧 Fixing violations...")
    text_files_fixed = 0
    bg_files_fixed = 0
    
    for tsx_file in Path(src_dir).rglob('*.tsx'):
        text_files_fixed += fix_text_colors(tsx_file)
        bg_files_fixed += fix_bg_colors(tsx_file)
    
    # Count violations after
    print()
    print("📊 Counting violations after fixes...")
    after_text, after_bg = count_violations(src_dir)
    print(f"  - text-gray violations: {after_text} (was {before_text})")
    print(f"  - bg-gray violations: {after_bg} (was {before_bg})")
    print()
    
    # Summary
    text_fixed = before_text - after_text
    bg_fixed = before_bg - after_bg
    
    print(f"✅ Fixed {text_fixed} text-gray violations in {text_files_fixed} files")
    print(f"✅ Fixed {bg_fixed} bg-gray violations in {bg_files_fixed} files")
    print()
    print("🎉 Automated fixes complete!")

if __name__ == '__main__':
    main()
