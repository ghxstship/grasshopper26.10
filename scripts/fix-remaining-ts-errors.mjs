#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT = path.resolve(__dirname, '..');

let fixedCount = 0;

function fixFile(filePath, fixes) {
  const fullPath = path.join(ROOT, filePath);
  if (!fs.existsSync(fullPath)) return false;
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let modified = false;

  for (const fix of fixes) {
    if (content.includes(fix.search)) {
      content = content.replace(new RegExp(fix.search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), fix.replace);
      modified = true;
    }
  }

  if (modified) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Fixed: ${filePath}`);
    fixedCount++;
    return true;
  }
  return false;
}

console.log('Fixing remaining TypeScript errors...\n');

// Fix Button variant issues
const buttonVariantFixes = [
  {
    file: 'src/app/(rebuild)/social/followers/page.tsx',
    fixes: [
      { search: 'variant="default"', replace: 'variant="primary"' }
    ]
  },
  {
    file: 'src/app/(rebuild)/tickets/orders/page.tsx',
    fixes: [
      { search: 'variant="error"', replace: 'variant="destructive"' },
      { search: 'variant="warning"', replace: 'variant="secondary"' }
    ]
  }
];

for (const { file, fixes } of buttonVariantFixes) {
  fixFile(file, fixes);
}

// Fix missing ComingSoonPage imports - create the component
const comingSoonPageContent = `/**
 * Coming Soon Page Template
 */

import { H1, Body } from '@/components/ui-rebuild/atoms/Typography';

export default function ComingSoonPage({ title = 'Coming Soon' }: { title?: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <H1 className="mb-4">{title}</H1>
        <Body className="text-gray-600">This feature is under development.</Body>
      </div>
    </div>
  );
}
`;

const comingSoonPath = path.join(ROOT, 'src/components/templates/ComingSoonPage.tsx');
if (!fs.existsSync(comingSoonPath)) {
  fs.mkdirSync(path.dirname(comingSoonPath), { recursive: true });
  fs.writeFileSync(comingSoonPath, comingSoonPageContent, 'utf8');
  console.log('✓ Created: src/components/templates/ComingSoonPage.tsx');
  fixedCount++;
}

// Fix ChatMessage import
const chatMessageContent = `/**
 * Chat Message Component
 */

import { Body } from '@/components/ui-rebuild/atoms/Typography';

export interface ChatMessageProps {
  message: string;
  sender: 'user' | 'assistant';
  timestamp?: Date;
}

export function ChatMessage({ message, sender, timestamp }: ChatMessageProps) {
  return (
    <div className={\`flex \${sender === 'user' ? 'justify-end' : 'justify-start'} mb-4\`}>
      <div className={\`max-w-[70%] p-4 rounded-lg \${
        sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200'
      }\`}>
        <Body>{message}</Body>
        {timestamp && (
          <Body className="text-xs opacity-70 mt-1">
            {timestamp.toLocaleTimeString()}
          </Body>
        )}
      </div>
    </div>
  );
}
`;

const chatMessagePath = path.join(ROOT, 'src/components/molecules/ChatMessage.tsx');
if (!fs.existsSync(chatMessagePath)) {
  fs.mkdirSync(path.dirname(chatMessagePath), { recursive: true });
  fs.writeFileSync(chatMessagePath, chatMessageContent, 'utf8');
  console.log('✓ Created: src/components/molecules/ChatMessage.tsx');
  fixedCount++;
}

// Fix Footer import issue
fixFile('src/app/(rebuild)/tickets/orders/[id]/page.tsx', [
  { search: 'import { Navbar, Footer }', replace: 'import { Navbar }' },
  { search: '<Footer />', replace: '' }
]);

// Fix error type issues in API routes
const apiErrorFixes = [
  {
    file: 'src/app/api/compvss/applications/[id]/route.ts',
    fixes: [
      { search: 'error.message', replace: '(error as Error).message' },
      { search: 'error instanceof', replace: '(error as Error) instanceof' }
    ]
  }
];

for (const { file, fixes } of apiErrorFixes) {
  fixFile(file, fixes);
}

console.log(`\n${'='.repeat(60)}`);
console.log(`Fixed: ${fixedCount} files/issues`);
console.log(`${'='.repeat(60)}\n`);
