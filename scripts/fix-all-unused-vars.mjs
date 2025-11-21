#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// Files with unused variables and their fixes
const fixes = [
  {
    file: 'src/app/atlvs/analytics/trends/page.tsx',
    find: /const \{ data: analyticsData \} = useAnalyticsData\(\);/g,
    replace: 'useAnalyticsData(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/assets/analytics/page.tsx',
    find: /const \{ data: assetsData \} = useAssets\(\);/g,
    replace: 'useAssets(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/assets/calendar/page.tsx',
    find: /const \{ data: assetsData \} = useAssets\(\);/g,
    replace: 'useAssets(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/automation/builder/page.tsx',
    find: /const \{ data: automationData \} = useAutomation\(\);/g,
    replace: 'useAutomation(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/automation/monitoring/page.tsx',
    find: /const \{ data: workflowsData \} = useWorkflows\(\);/g,
    replace: 'useWorkflows(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/documents/contracts/page.tsx',
    find: /const \{ data: documents,/g,
    replace: 'const { data: _documents,'
  },
  {
    file: 'src/app/atlvs/documents/upload/page.tsx',
    find: /const \[files, setFiles\] = useState<File\[\]>\(\[\]\);/g,
    replace: 'const [files] = useState<File[]>([]);'
  },
  {
    file: 'src/app/atlvs/documents/version-control/page.tsx',
    find: /const \{ data: docs,/g,
    replace: 'const { data: _docs,'
  },
  {
    file: 'src/app/atlvs/projects/[id]/files/page.tsx',
    find: /const \{ data: projectData \} = useProject\(id\);/g,
    replace: 'useProject(id); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/projects/[id]/page.tsx',
    find: /const \{ data: projectData \} = useProject\(id\);/g,
    replace: 'useProject(id); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/atlvs/tasks/dependencies/page.tsx',
    find: /const \[searchQuery, setSearchQuery\] = useState\(''\);/g,
    replace: 'const [searchQuery] = useState(\'\');'
  },
  {
    file: 'src/app/atlvs/tasks/list/page.tsx',
    find: /const \[statusFilter, setStatusFilter\] = useState<string\| null>\(null\);/g,
    replace: 'const [statusFilter] = useState<string | null>(null);'
  },
  {
    file: 'src/app/atlvs/tasks/list/page.tsx',
    find: /const \[priorityFilter, setPriorityFilter\] = useState<string\| null>\(null\);/g,
    replace: 'const [priorityFilter] = useState<string | null>(null);'
  },
  {
    file: 'src/app/atlvs/tasks/time-tracking/page.tsx',
    find: /const \[activeTimer, setActiveTimer\] = useState<string\| null>\(null\);/g,
    replace: 'const [activeTimer] = useState<string | null>(null);'
  },
  {
    file: 'src/app/atlvs/teams/page.tsx',
    find: /const \{ data: teams, isLoading, error, refetch \} = useTeams\(\);/g,
    replace: 'const { data: teams } = useTeams();'
  },
  {
    file: 'src/app/atlvs/teams/roles/page.tsx',
    find: /const \[searchQuery, setSearchQuery\] = useState\(''\);/g,
    replace: 'const [searchQuery] = useState(\'\');'
  },
  {
    file: 'src/app/compvss/auth/invite/page.tsx',
    find: /const \{ data: authData \} = useAuth\(\);/g,
    replace: 'useAuth(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/compvss/dashboard/day-of-show/page.tsx',
    find: /const \{ data: dayOfShowData \} = useDayOfShow\(\);/g,
    replace: 'useDayOfShow(); // Keep hook call for data fetching'
  },
  {
    file: 'src/app/compvss/referrals/dashboard/page.tsx',
    find: /const \{ data: leaderboard, isLoading: leaderboardLoading \} = useLeaderboard\(\);/g,
    replace: 'const { data: leaderboard } = useLeaderboard();'
  },
  {
    file: 'src/app/compvss/team/directory/page.tsx',
    find: /const \[searchQuery, setSearchQuery\] = useState\(''\);/g,
    replace: 'const [searchQuery] = useState(\'\');'
  }
];

// Files with unused imports to remove
const unusedImports = [
  {
    file: 'src/app/atlvs/analytics/scheduled-reports/page.tsx',
    removes: ['Card', 'CardHeader', 'CardTitle', 'CardContent', 'Badge']
  },
  {
    file: 'src/app/atlvs/teams/assign-roles/page.tsx',
    removes: ['CardHeader', 'CardTitle', 'Badge', 'Role']
  },
  {
    file: 'src/app/atlvs/teams/availability/page.tsx',
    removes: ['Card', 'CardHeader', 'CardTitle', 'CardDescription', 'CardContent', 'Badge']
  },
  {
    file: 'src/app/atlvs/teams/schedule/page.tsx',
    removes: ['CardTitle', 'Badge']
  },
  {
    file: 'src/app/compvss/dashboard/page.tsx',
    removes: ['Bell']
  },
  {
    file: 'src/app/compvss/issues/dashboard/page.tsx',
    removes: ['Filter']
  },
  {
    file: 'src/components/atlvs/DataTable.tsx',
    removes: ['BodyTextSmall']
  }
];

// Apply variable fixes
let fixedCount = 0;
for (const fix of fixes) {
  const filePath = path.join(rootDir, fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fix.file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content.replace(fix.find, fix.replace);
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Fixed: ${fix.file}`);
    fixedCount++;
  }
}

// Remove unused imports
for (const { file, removes } of unusedImports) {
  const filePath = path.join(rootDir, file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  
  for (const unusedImport of removes) {
    // Remove from import statements
    const importPattern = new RegExp(`\\b${unusedImport}\\b,?\\s*`, 'g');
    content = content.replace(importPattern, '');
    
    // Clean up any double commas or trailing commas in imports
    content = content.replace(/,\s*,/g, ',');
    content = content.replace(/{\s*,/g, '{');
    content = content.replace(/,\s*}/g, '}');
    content = content.replace(/{\s*}/g, '');
  }
  
  fs.writeFileSync(filePath, content, 'utf-8');
  console.log(`✅ Removed unused imports from: ${file}`);
  fixedCount++;
}

// Fix function parameters
const paramFixes = [
  {
    file: 'src/components/atlvs/KanbanBoard.tsx',
    find: /onTaskMove: \(taskId: string, newColumnId: string\) => void;/g,
    replace: '_onTaskMove: (taskId: string, newColumnId: string) => void;'
  },
  {
    file: 'src/lib/rbac/utils.ts',
    find: /role: Role\b/g,
    replace: '_role: Role'
  }
];

for (const fix of paramFixes) {
  const filePath = path.join(rootDir, fix.file);
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${fix.file}`);
    continue;
  }
  
  let content = fs.readFileSync(filePath, 'utf-8');
  const newContent = content.replace(fix.find, fix.replace);
  
  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    console.log(`✅ Fixed parameters: ${fix.file}`);
    fixedCount++;
  }
}

console.log(`\n✨ Fixed ${fixedCount} files total`);
