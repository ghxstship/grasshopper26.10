#!/usr/bin/env tsx
/**
 * Test Generation Tool
 * Automatically generates test files for services, hooks, and components
 */

import fs from 'fs';
import path from 'path';
import { glob } from 'glob';

interface TestTarget {
  sourcePath: string;
  testPath: string;
  type: 'service' | 'hook' | 'component' | 'utility';
  name: string;
  hasTest: boolean;
}

/**
 * Generate service test template
 */
function generateServiceTest(name: string, sourcePath: string): string {
  return `import { ${name} } from '${sourcePath.replace(/\.ts$/, '')}';
import { prisma } from '@/lib/prisma';

// Mock Prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    // Add mock methods
  },
}));

describe('${name}', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('CRUD Operations', () => {
    it('should create a record', async () => {
      // Arrange
      const data = { /* test data */ };
      
      // Act
      const result = await ${name}.create(data);
      
      // Assert
      expect(result).toBeDefined();
      expect(result.id).toBeDefined();
    });

    it('should read a record', async () => {
      // Arrange
      const id = 'test-id';
      
      // Act
      const result = await ${name}.findById(id);
      
      // Assert
      expect(result).toBeDefined();
    });

    it('should update a record', async () => {
      // Arrange
      const id = 'test-id';
      const updates = { /* update data */ };
      
      // Act
      const result = await ${name}.update(id, updates);
      
      // Assert
      expect(result).toBeDefined();
    });

    it('should delete a record', async () => {
      // Arrange
      const id = 'test-id';
      
      // Act
      await ${name}.delete(id);
      
      // Assert
      // Verify deletion
    });
  });

  describe('Error Handling', () => {
    it('should handle not found errors', async () => {
      // Arrange
      const id = 'non-existent-id';
      
      // Act & Assert
      await expect(${name}.findById(id)).rejects.toThrow();
    });

    it('should handle validation errors', async () => {
      // Arrange
      const invalidData = {};
      
      // Act & Assert
      await expect(${name}.create(invalidData)).rejects.toThrow();
    });
  });

  describe('Business Logic', () => {
    it('should implement business rules', async () => {
      // Add business logic tests
    });
  });
});
`;
}

/**
 * Generate hook test template
 */
function generateHookTest(name: string, sourcePath: string): string {
  return `import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ${name} } from '${sourcePath.replace(/\.tsx?$/, '')}';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

describe('${name}', () => {
  it('should fetch data successfully', async () => {
    const { result } = renderHook(() => ${name}(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toBeDefined();
  });

  it('should handle loading state', () => {
    const { result } = renderHook(() => ${name}(), {
      wrapper: createWrapper(),
    });

    expect(result.current.isLoading).toBe(true);
  });

  it('should handle errors', async () => {
    // Mock error
    const { result } = renderHook(() => ${name}(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });

  it('should refetch data', async () => {
    const { result } = renderHook(() => ${name}(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    result.current.refetch();

    await waitFor(() => {
      expect(result.current.isFetching).toBe(true);
    });
  });
});
`;
}

/**
 * Generate component test template
 */
function generateComponentTest(name: string, sourcePath: string): string {
  return `import { render, screen, fireEvent } from '@testing-library/react';
import { ${name} } from '${sourcePath.replace(/\.tsx$/, '')}';

describe('${name}', () => {
  it('should render successfully', () => {
    render(<${name} />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display content', () => {
    render(<${name} />);
    // Add content assertions
  });

  it('should handle user interactions', () => {
    render(<${name} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    // Assert interaction results
  });

  it('should handle props correctly', () => {
    const props = {
      // Add test props
    };
    
    render(<${name} {...props} />);
    
    // Assert prop handling
  });

  it('should be accessible', () => {
    const { container } = render(<${name} />);
    
    // Check for accessibility attributes
    expect(container.querySelector('[aria-label]')).toBeInTheDocument();
  });
});
`;
}

/**
 * Generate utility test template
 */
function generateUtilityTest(name: string, sourcePath: string): string {
  return `import { ${name} } from '${sourcePath.replace(/\.ts$/, '')}';

describe('${name}', () => {
  describe('Basic Functionality', () => {
    it('should work with valid input', () => {
      // Arrange
      const input = /* test input */;
      
      // Act
      const result = ${name}(input);
      
      // Assert
      expect(result).toBeDefined();
    });

    it('should handle edge cases', () => {
      // Test edge cases
      expect(${name}(null)).toBe(/* expected */);
      expect(${name}(undefined)).toBe(/* expected */);
      expect(${name}('')).toBe(/* expected */);
    });
  });

  describe('Error Handling', () => {
    it('should throw on invalid input', () => {
      expect(() => ${name}(/* invalid */)).toThrow();
    });

    it('should return default on error', () => {
      const result = ${name}(/* invalid */, /* default */);
      expect(result).toBe(/* default */);
    });
  });

  describe('Performance', () => {
    it('should handle large inputs efficiently', () => {
      const largeInput = /* generate large input */;
      const start = performance.now();
      
      ${name}(largeInput);
      
      const duration = performance.now() - start;
      expect(duration).toBeLessThan(100); // 100ms threshold
    });
  });
});
`;
}

/**
 * Analyze source file
 */
function analyzeSource(sourcePath: string): TestTarget {
  const relativePath = sourcePath.replace(process.cwd(), '');
  const name = path.basename(sourcePath, path.extname(sourcePath));
  
  const type = sourcePath.includes('/services/') ? 'service'
    : sourcePath.includes('/hooks/') ? 'hook'
    : sourcePath.includes('/components/') ? 'component'
    : sourcePath.includes('/lib/') && !sourcePath.includes('/hooks/') ? 'utility'
    : 'utility';
  
  const testPath = sourcePath
    .replace('/src/', '/src/__tests__/')
    .replace(/\.(tsx?)$/, '.test.$1');
  
  return {
    sourcePath: relativePath,
    testPath,
    type,
    name,
    hasTest: fs.existsSync(testPath),
  };
}

/**
 * Generate test file
 */
function generateTest(target: TestTarget, dryRun: boolean = true): boolean {
  if (target.hasTest) {
    console.log(`✓ ${target.sourcePath} - Test exists`);
    return false;
  }
  
  try {
    let testContent: string;
    
    switch (target.type) {
      case 'service':
        testContent = generateServiceTest(target.name, target.sourcePath);
        break;
      case 'hook':
        testContent = generateHookTest(target.name, target.sourcePath);
        break;
      case 'component':
        testContent = generateComponentTest(target.name, target.sourcePath);
        break;
      case 'utility':
        testContent = generateUtilityTest(target.name, target.sourcePath);
        break;
      default:
        return false;
    }
    
    if (dryRun) {
      console.log(`→ ${target.sourcePath} - Would generate test (${target.type})`);
      return true;
    }
    
    // Create test directory
    const testDir = path.dirname(target.testPath);
    fs.mkdirSync(testDir, { recursive: true });
    
    // Write test file
    fs.writeFileSync(target.testPath, testContent);
    
    console.log(`✓ ${target.sourcePath} - Test generated`);
    return true;
  } catch (error) {
    console.error(`✗ ${target.sourcePath} - Generation failed:`, error);
    return false;
  }
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  const dryRun = !args.includes('--apply');
  const type = args.find(arg => ['service', 'hook', 'component', 'utility'].includes(arg));
  
  console.log('🧪 Test Generation Tool');
  console.log(`Mode: ${dryRun ? 'DRY RUN' : 'APPLY CHANGES'}`);
  console.log(`Filter: ${type || 'ALL TYPES'}\n`);
  
  // Find all source files
  const patterns = [
    'src/lib/services/**/*.ts',
    'src/lib/hooks/**/*.ts',
    'src/components/**/*.tsx',
    'src/lib/**/*.ts',
  ];
  
  const sourceFiles = (await Promise.all(
    patterns.map(pattern => glob(pattern, {
      ignore: ['**/*.test.*', '**/*.spec.*', '**/node_modules/**', '**/__tests__/**'],
    }))
  )).flat();
  
  console.log(`Found ${sourceFiles.length} source files\n`);
  
  // Analyze sources
  const targets = sourceFiles.map(analyzeSource);
  
  // Filter by type if specified
  const filteredTargets = type
    ? targets.filter(t => t.type === type)
    : targets;
  
  // Group by status
  const withTests = filteredTargets.filter(t => t.hasTest);
  const needsTests = filteredTargets.filter(t => !t.hasTest);
  
  console.log('📊 Status:');
  console.log(`  ✓ Has tests: ${withTests.length}`);
  console.log(`  → Needs tests: ${needsTests.length}\n`);
  
  // Show breakdown by type
  console.log('📋 By Type:');
  ['service', 'hook', 'component', 'utility'].forEach(typeName => {
    const typeTargets = filteredTargets.filter(t => t.type === typeName);
    const typeTested = typeTargets.filter(t => t.hasTest).length;
    const typeTotal = typeTargets.length;
    if (typeTotal > 0) {
      const percentage = Math.round((typeTested / typeTotal) * 100);
      console.log(`  ${typeName}: ${typeTested}/${typeTotal} (${percentage}%)`);
    }
  });
  
  if (needsTests.length === 0) {
    console.log('\n✅ All files have tests!');
    return;
  }
  
  console.log(`\n${dryRun ? '🔍 Would generate' : '🔧 Generating'} ${needsTests.length} tests...\n`);
  
  // Generate tests
  let successCount = 0;
  for (const target of needsTests) {
    if (generateTest(target, dryRun)) {
      successCount++;
    }
  }
  
  console.log(`\n${dryRun ? '📝 Summary' : '✅ Generation Complete'}:`);
  console.log(`  ${successCount} tests ${dryRun ? 'would be' : 'were'} generated`);
  
  if (dryRun) {
    console.log('\n💡 To apply changes, run: npm run generate-tests -- --apply');
    console.log('💡 To generate specific type: npm run generate-tests -- --apply service');
  }
}

main().catch(console.error);
