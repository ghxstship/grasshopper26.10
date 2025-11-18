# Hook Enhancement Guide

**Quick reference for adding error handling, retry logic, and optimistic updates to React hooks**

## Quick Start

### 1. Enhance Existing Query Hook

```typescript
// Before
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: fetchEvents,
  });
}

// After - with enhancement
import { createEnhancedQuery } from '@/lib/hooks/hook-enhancer';

export function useEvents() {
  return createEnhancedQuery(
    ['events'],
    fetchEvents,
    {
      shouldRetryOnError: true,
      errorRetryCount: 3,
      staleTime: 5 * 60 * 1000,
      onError: (error) => {
        toast.error('Failed to load events');
      },
    }
  );
}
```

### 2. Enhance Mutation Hook

```typescript
// Before
export function useCreateEvent() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
}

// After - with enhancement
import { createEnhancedMutation } from '@/lib/hooks/hook-enhancer';

export function useCreateEvent() {
  return createEnhancedMutation(
    createEvent,
    {
      invalidateQueries: [['events']],
      optimisticUpdate: (variables) => {
        // Update UI immediately
        useEventStore.getState().addEvent(variables);
      },
      onError: (error) => {
        toast.error('Failed to create event');
      },
    }
  );
}
```

## Enhancement Options

### Query Options

```typescript
{
  // Retry configuration
  shouldRetryOnError: true,        // Enable retry on error
  errorRetryCount: 3,              // Number of retries
  errorRetryInterval: 1000,        // Initial delay (ms)
  
  // Error handling
  onError: (error) => {},          // Error callback
  trackErrors: true,               // Track in error monitoring
  errorCategory: ErrorCategory.API, // Error category
  
  // Logging
  logQueries: true,                // Log query execution
  
  // Standard React Query options
  staleTime: 5 * 60 * 1000,
  cacheTime: 10 * 60 * 1000,
  refetchOnWindowFocus: true,
}
```

### Mutation Options

```typescript
{
  // Optimistic updates
  optimisticUpdate: (variables) => {
    // Update UI before server response
  },
  
  // Error handling
  onError: (error, variables) => {},
  trackErrors: true,
  errorCategory: ErrorCategory.API,
  
  // Retry configuration
  shouldRetryOnError: false,
  retryCount: 1,
  
  // Logging
  logMutations: true,
  
  // Invalidation
  invalidateQueries: [
    ['events'],
    ['events', eventId],
  ],
}
```

## Hooks Requiring Enhancement

### Priority 1: Data Fetching Hooks (50 hooks)

**GVTEWAY (16 hooks)**
- [ ] `useEvents` - Already enhanced ✅
- [ ] `useTickets` - Already enhanced ✅
- [ ] `useOrders`
- [ ] `useProducts`
- [ ] `useVenues`
- [ ] `useSocial`
- [ ] `useMemberships`
- [ ] `useLoyalty`
- [ ] `useWallet`
- [ ] `useAdventures`
- [ ] `useMessages`
- [ ] `useAlerts`
- [ ] `usePaymentMethods`
- [ ] `useWishlist`
- [ ] `useAnalytics`
- [ ] `useReports`

**COMPVSS (15 hooks)**
- [ ] `useAdvancingRequests` - Already enhanced ✅
- [ ] `useAffiliates` - Already enhanced ✅
- [ ] `useTeams`
- [ ] `useExpenses`
- [ ] `useIssues`
- [ ] `useQRCodes`
- [ ] `useCheckIns`
- [ ] `useOperations`
- [ ] `useCredentials`
- [ ] `useDocuments`
- [ ] `useReports`
- [ ] `useAnalytics`
- [ ] `useNotifications`
- [ ] `useSettings`
- [ ] `useProfile`

**ATLVS (19 hooks)**
- [ ] `useProjects` - Already enhanced ✅
- [ ] `useTasks` - Already enhanced ✅
- [ ] `useBudgets` - Already enhanced ✅
- [ ] `useAssets`
- [ ] `useEquipment`
- [ ] `useVehicles`
- [ ] `useDocuments`
- [ ] `useTeams`
- [ ] `useTimeEntries`
- [ ] `useMilestones`
- [ ] `usePhases`
- [ ] `useContracts`
- [ ] `useAutomation`
- [ ] `useDashboards`
- [ ] `useReports`
- [ ] `useIntegrations`
- [ ] `useOpportunities`
- [ ] `useApplications`
- [ ] `useAnalytics`

### Priority 2: Shared Hooks (10 hooks)

- [ ] `useOrganizations`
- [ ] `useProfile`
- [ ] `useNotifications`
- [ ] `useFiles`
- [ ] `useSearch`
- [ ] `useSettings`
- [ ] `useAuditLogs`
- [ ] `usePermissions`
- [ ] `useRoles`
- [ ] `useUsers`

## Bulk Enhancement Script

Create a script to enhance all hooks in a directory:

```typescript
// scripts/enhance-hooks.ts
import fs from 'fs';
import path from 'path';

const HOOK_TEMPLATE = `
import { createEnhancedQuery, createEnhancedMutation } from '@/lib/hooks/hook-enhancer';

// Add to existing hooks:
// - shouldRetryOnError: true
// - errorRetryCount: 3
// - onError callback
// - invalidateQueries for mutations
`;

function enhanceHooksInDirectory(dir: string) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    if (file.startsWith('use') && file.endsWith('.ts')) {
      console.log(`Enhancing ${file}...`);
      // Add enhancement logic
    }
  });
}

enhanceHooksInDirectory('src/lib/hooks/gvteway');
enhanceHooksInDirectory('src/lib/hooks/compvss');
enhanceHooksInDirectory('src/lib/hooks/atlvs');
enhanceHooksInDirectory('src/lib/hooks/shared');
```

## Testing Enhanced Hooks

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEnhancedEvents } from './useEvents';

describe('useEnhancedEvents', () => {
  it('should retry on error', async () => {
    const queryClient = new QueryClient();
    const wrapper = ({ children }) => (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );

    const { result } = renderHook(() => useEnhancedEvents(), { wrapper });

    await waitFor(() => {
      expect(result.current.isError).toBe(false);
    });
  });

  it('should handle errors', async () => {
    const onError = jest.fn();
    // Test error handling
  });

  it('should perform optimistic updates', async () => {
    // Test optimistic updates
  });
});
```

## Common Patterns

### Pattern 1: List + Detail Hooks

```typescript
// List hook
export function useEvents() {
  return createEnhancedQuery(
    ['events'],
    fetchEvents,
    {
      staleTime: 5 * 60 * 1000,
      shouldRetryOnError: true,
    }
  );
}

// Detail hook
export function useEvent(id: string) {
  return createEnhancedQuery(
    ['event', id],
    () => fetchEvent(id),
    {
      enabled: !!id,
      staleTime: 5 * 60 * 1000,
    }
  );
}

// Create mutation
export function useCreateEvent() {
  return createEnhancedMutation(
    createEvent,
    {
      invalidateQueries: [['events']],
      onSuccess: () => {
        toast.success('Event created');
      },
    }
  );
}

// Update mutation
export function useUpdateEvent() {
  return createEnhancedMutation(
    ({ id, data }) => updateEvent(id, data),
    {
      invalidateQueries: [['events'], ['event']],
      optimisticUpdate: ({ id, data }) => {
        // Update cache immediately
      },
    }
  );
}

// Delete mutation
export function useDeleteEvent() {
  return createEnhancedMutation(
    deleteEvent,
    {
      invalidateQueries: [['events']],
      onSuccess: () => {
        toast.success('Event deleted');
      },
    }
  );
}
```

### Pattern 2: Paginated Data

```typescript
export function usePaginatedEvents(page: number, limit: number) {
  return createEnhancedQuery(
    ['events', { page, limit }],
    () => fetchEvents({ page, limit }),
    {
      keepPreviousData: true,
      staleTime: 2 * 60 * 1000,
    }
  );
}
```

### Pattern 3: Dependent Queries

```typescript
export function useEventTickets(eventId: string) {
  return createEnhancedQuery(
    ['event', eventId, 'tickets'],
    () => fetchEventTickets(eventId),
    {
      enabled: !!eventId,
      staleTime: 1 * 60 * 1000,
    }
  );
}
```

## Migration Checklist

For each hook file:
- [ ] Import `createEnhancedQuery` or `createEnhancedMutation`
- [ ] Add retry configuration
- [ ] Add error handling with `onError`
- [ ] Add error tracking
- [ ] Add query invalidation for mutations
- [ ] Add optimistic updates where appropriate
- [ ] Add JSDoc documentation
- [ ] Write tests
- [ ] Update usage in components

## Performance Considerations

- **Retry logic**: Adds delay on failures (expected)
- **Error tracking**: ~1-2ms overhead per error
- **Logging**: Minimal overhead (<1ms)
- **Optimistic updates**: Improves perceived performance

## Best Practices

1. **Always add retry for external APIs**
2. **Use optimistic updates for better UX**
3. **Track errors for monitoring**
4. **Invalidate related queries after mutations**
5. **Add appropriate stale times**
6. **Use error callbacks for user feedback**
7. **Document hook behavior with JSDoc**

## Troubleshooting

**Hooks not retrying?**
- Check `shouldRetryOnError` is `true`
- Verify error is retryable
- Check retry count

**Optimistic updates not working?**
- Ensure query key matches
- Check update function logic
- Verify rollback on error

**Too many refetches?**
- Increase `staleTime`
- Disable `refetchOnWindowFocus`
- Use `keepPreviousData` for pagination
