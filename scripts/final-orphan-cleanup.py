#!/usr/bin/env python3
"""
Final cleanup of orphaned gradient classes
Only removes actual color gradient classes, not legitimate uses like 'finish-to-start'
"""

import re
import glob

def clean_file(filepath):
    """Remove orphaned gradient color classes"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    original = content
    
    # Only match actual color gradient classes in className strings
    # Pattern: className="... from-color to-color ..."
    # Don't match: type: 'finish-to-start', text like "Finish-to-Start", etc.
    
    # Remove orphaned from-black, to-black, via-black patterns
    content = re.sub(r'(\bclassName="[^"]*)\s+from-black([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+to-black([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+via-black([^"]*")', r'\1\2', content)
    
    # Remove orphaned from-ghxst-*, to-ghxst-*, via-ghxst-* patterns
    content = re.sub(r'(\bclassName="[^"]*)\s+from-ghxst-[a-z]+/[0-9]+([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+to-ghxst-[a-z]+/[0-9]+([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+via-ghxst-[a-z]+/[0-9]+([^"]*")', r'\1\2', content)
    
    # Remove orphaned from-info/*, to-info/*, via-info/* patterns
    content = re.sub(r'(\bclassName="[^"]*)\s+from-info/[0-9]+([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+to-info/[0-9]+([^"]*")', r'\1\2', content)
    content = re.sub(r'(\bclassName="[^"]*)\s+via-info/[0-9]+([^"]*")', r'\1\2', content)
    
    # Clean up double spaces
    content = re.sub(r'  +', ' ', content)
    content = re.sub(r' "', '"', content)
    
    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        return True
    return False

def main():
    files_to_check = [
        'src/app/gvteway/settings/profile/page.tsx',
        'src/app/gvteway/opportunities/[slug]/page.tsx',
        'src/app/gvteway/memberships/join/page.tsx',
        'src/app/gvteway/events/[id]/page.tsx',
        'src/app/gvteway/events/[slug]/page.tsx',
        'src/app/gvteway/analytics/spending/page.tsx',
        'src/app/gvteway/analytics/recommendations/page.tsx',
        'src/app/gvteway/analytics/history/page.tsx',
        'src/app/compvss/settings/privacy/page.tsx',
        'src/app/compvss/settings/security/page.tsx',
        'src/app/compvss/settings/account/page.tsx',
        'src/app/compvss/settings/notifications/page.tsx',
        'src/app/compvss/referrals/rewards/page.tsx',
        'src/app/compvss/referrals/leaderboard/page.tsx',
        'src/app/compvss/referrals/dashboard/page.tsx',
        'src/app/compvss/referrals/history/page.tsx',
        'src/app/compvss/operations/schedule/page.tsx',
        'src/app/compvss/operations/checkin/page.tsx',
        'src/app/compvss/dashboard/schedule/page.tsx',
        'src/app/compvss/dashboard/tasks/page.tsx',
        'src/app/compvss/dashboard/day-of-show/page.tsx',
        'src/app/compvss/affiliates/settings/page.tsx',
        'src/app/compvss/affiliates/links/page.tsx',
        'src/app/compvss/affiliates/earnings/page.tsx',
        'src/app/compvss/affiliates/payouts/page.tsx',
        'src/app/compvss/affiliates/stats/page.tsx',
        'src/app/compvss/issues/detail/[id]/page.tsx',
        'src/app/atlvs/analytics/kpis/page.tsx',
    ]
    
    print("🔍 Cleaning orphaned gradient classes...")
    modified = 0
    
    for filepath in files_to_check:
        if clean_file(filepath):
            print(f"✅ {filepath}")
            modified += 1
        else:
            print(f"⏭️  {filepath}")
    
    print()
    print(f"✨ Modified {modified} files")
    print()
    print("🔍 Final verification...")
    
    # Check for any remaining gradient classes
    import subprocess
    result = subprocess.run(
        ['grep', '-r', 'from-\\|via-\\|to-', 'src/app', '--include=*.tsx'],
        capture_output=True,
        text=True
    )
    
    # Filter out legitimate uses
    lines = result.stdout.split('\n')
    gradient_lines = [
        line for line in lines
        if line and 'transform' not in line and 'translate' not in line
        and 'finish-to-start' not in line and 'start-to-start' not in line
        and 'Finish-to-' not in line and 'Start-to-' not in line
        and 'type:' not in line and 'Auto-' not in line
    ]
    
    if not gradient_lines:
        print("✅ 100% gradient removal achieved!")
        print("All gradient classes have been removed from the codebase.")
    else:
        print(f"⚠️  {len(gradient_lines)} potential gradient references remain")
        print("\nRemaining references (first 10):")
        for line in gradient_lines[:10]:
            print(f"  {line}")

if __name__ == '__main__':
    main()
