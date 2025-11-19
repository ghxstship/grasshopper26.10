#!/usr/bin/env python3
"""
Fix all AtlvsService method calls to use Prisma directly
"""

import re
from pathlib import Path

def fix_file(filepath):
    """Fix a single file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Map of service calls to prisma calls based on context
    # We need to infer the model from the file path
    file_path_str = str(filepath)
    
    # Determine the model based on file path
    if 'equipment' in file_path_str:
        model = 'equipment'
    elif 'tasks' in file_path_str or 'task' in file_path_str:
        model = 'task'
    elif 'projects' in file_path_str or 'project' in file_path_str:
        model = 'project'
    elif 'teams' in file_path_str or 'team' in file_path_str:
        model = 'team'
    elif 'budgets' in file_path_str or 'budget' in file_path_str:
        model = 'budget'
    else:
        return False  # Unknown model
    
    # Fix findAll calls
    content = re.sub(
        r'await new AtlvsService\(\)\.findAll\(\{',
        f'await prisma.{model}.findMany({{',
        content
    )
    
    # Fix findById calls with object parameter
    content = re.sub(
        r'await new AtlvsService\(\)\.findById\(\{\s*where:\s*\{\s*id\s*\}\s*\}\)',
        f'await prisma.{model}.findUnique({{ where: {{ id }} }})',
        content
    )
    
    # Fix findById calls with simple id parameter
    content = re.sub(
        r'await new AtlvsService\(\)\.findById\(id\)',
        f'await prisma.{model}.findUnique({{ where: {{ id }} }})',
        content
    )
    
    # Fix create calls
    content = re.sub(
        r'await new AtlvsService\(\)\.create\(\{',
        f'await prisma.{model}.create({{',
        content
    )
    
    # Fix update calls with object parameter
    content = re.sub(
        r'await new AtlvsService\(\)\.update\(\{\s*where:\s*\{\s*id\s*\},\s*data:',
        f'await prisma.{model}.update({{ where: {{ id }}, data:',
        content
    )
    
    # Fix update calls with id, data parameters
    content = re.sub(
        r'await new AtlvsService\(\)\.update\(id,\s*',
        f'await prisma.{model}.update({{ where: {{ id }}, data: ',
        content
    )
    
    # Fix delete calls with object parameter
    content = re.sub(
        r'await new AtlvsService\(\)\.delete\(\{\s*where:\s*\{\s*id\s*\}\s*\}\)',
        f'await prisma.{model}.delete({{ where: {{ id }} }})',
        content
    )
    
    # Fix delete calls with simple id parameter
    content = re.sub(
        r'await new AtlvsService\(\)\.delete\(id\)',
        f'await prisma.{model}.delete({{ where: {{ id }} }})',
        content
    )
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    
    return False

def main():
    """Fix all files with AtlvsService calls"""
    api_dir = Path(__file__).parent.parent / 'src' / 'app' / 'api' / 'atlvs'
    
    fixed_count = 0
    for route_file in api_dir.rglob('route.ts'):
        if fix_file(route_file):
            print(f"✓ Fixed: {route_file.relative_to(Path.cwd())}")
            fixed_count += 1
    
    print(f"\n✅ Fixed {fixed_count} files")

if __name__ == '__main__':
    print("🔧 Fixing all AtlvsService method calls...\n")
    main()
