# State Management Architecture

**Last Updated:** November 16, 2025

## Overview

Grasshopper uses a hybrid state management approach combining:
- **Zustand** for client-side application state (27 stores)
- **React Query** for server state and caching
- **Supabase Realtime** for real-time synchronization
- **Conflict Resolution** for concurrent edit handling

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                     React Components                         │
└────────────┬────────────────────────────────────────────────┘
             │
    ┌────────┴────────┐
    │                 │
┌───▼────┐      ┌────▼─────┐
│ Zustand│      │  React   │
│ Stores │      │  Query   │
└───┬────┘      └────┬─────┘
    │                │
    │           ┌────▼─────┐
    │           │  Cache   │
    │           └────┬─────┘
    │                │
┌───▼────────────────▼─────┐
│   Supabase Realtime      │
└───────────┬──────────────┘
            │
     ┌──────▼──────┐
     │  Database   │
     └─────────────┘
```

---

## Zustand Stores (27 Total)

### ATLVS Stores (9)

| Store | Purpose | Persistence | Key Features |
|-------|---------|-------------|--------------|
| `advancingStore` | Advancing requests | Partial (filters) | Comments, timeline, attachments |
| `assetStore` | Asset management | None | CRUD, filtering |
| `automationStore` | Workflow automation | None | Executions, triggers |
| `budgetStore` | Budget tracking | None | Allocations, expenses |
| `projectStore` | Project management | None | Phases, milestones |
| `taskStore` | Task management | Partial (filters) | Dependencies, assignments |
| `teamStore` | Team management | None | Members, roles |
| `equipmentStore` | Equipment tracking | None | Maintenance, assignments |
| `analyticsStore` | Analytics data | None | Dashboards, metrics |

### COMPVSS Stores (6)

| Store | Purpose | Persistence | Key Features |
|-------|---------|-------------|--------------|
| `advancingStore` | Advancing requests | Partial (filters) | Similar to ATLVS |
| `affiliateStore` | Affiliate management | None | Teams, credentials |
| `issueStore` | Issue tracking | None | Priority, status |
| `expenseStore` | Expense tracking | None | Categories, approvals |
| `qrStore` | QR code management | None | Generation, scanning |
| `checkInStore` | Check-in tracking | None | Locations, timestamps |

### GVTEWAY Stores (9)

| Store | Purpose | Persistence | Key Features |
|-------|---------|-------------|--------------|
| `eventStore` | Event management | None | Tickets, venues |
| `ticketStore` | Ticket inventory | None | Types, pricing |
| `cartStore` | Shopping cart | Full | Items, totals |
| `wishlistStore` | User wishlist | Full | Items, sharing |
| `walletStore` | Digital wallet | None | Balance, transactions |
| `socialStore` | Social features | None | Posts, comments |
| `adventureStore` | Adventure bookings | None | Itineraries, bookings |
| `membershipStore` | Membership tiers | None | Benefits, upgrades |
| `loyaltyStore` | Loyalty program | None | Points, rewards |

### Shared Stores (3)

| Store | Purpose | Persistence | Key Features |
|-------|---------|-------------|--------------|
| `notificationStore` | Notifications | Partial (filters) | Read/unread, filtering |
| `uiStore` | UI state | Partial (theme, layout) | Sidebar, modals, theme |
| `searchStore` | Global search | Partial (recent) | Results, filters |

---

## Store Patterns

### Standard Store Structure

```typescript
interface StoreState {
  // Data
  items: Item[];
  currentItem: Item | null;
  
  // UI State
  filters: FilterState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  setItems: (items: Item[]) => void;
  setCurrentItem: (item: Item | null) => void;
  addItem: (item: Item) => void;
  updateItem: (id: string, updates: Partial<Item>) => void;
  deleteItem: (id: string) => void;
  updateFilters: (filters: Partial<FilterState>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}
```

### Store Implementation Template

```typescript
import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

const initialState = {
  items: [],
  currentItem: null,
  filters: {},
  isLoading: false,
  error: null,
};

export const useMyStore = create<MyState>()(
  devtools(
    persist(
      (set) => ({
        ...initialState,
        
        setItems: (items) => set({ items }),
        
        addItem: (item) =>
          set((state) => ({
            items: [item, ...state.items],
          })),
        
        updateItem: (id, updates) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id ? { ...item, ...updates } : item
            ),
          })),
        
        deleteItem: (id) =>
          set((state) => ({
            items: state.items.filter((item) => item.id !== id),
          })),
        
        reset: () => set(initialState),
      }),
      {
        name: 'my-store-storage',
        partialize: (state) => ({
          filters: state.filters,
        }),
      }
    ),
    { name: 'MyStore' }
  )
);
```

---

## React Query Integration

### Query Hooks Pattern

```typescript
// Fetch list
export function useItems() {
  const { setItems, setLoading, setError } = useMyStore();
  
  return useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await fetchItems();
        setItems(data);
        setError(null);
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    staleTime: 5 * 60 * 1000,
  });
}

// Fetch single item
export function useItem(id: string) {
  const { setCurrentItem, setLoading, setError } = useMyStore();
  
  return useQuery({
    queryKey: ['item', id],
    queryFn: async () => {
      setLoading(true);
      try {
        const data = await fetchItem(id);
        setCurrentItem(data);
        setError(null);
        return data;
      } catch (error) {
        setError(error.message);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    enabled: !!id,
  });
}

// Create mutation
export function useCreateItem() {
  const queryClient = useQueryClient();
  const { addItem } = useMyStore();
  
  return useMutation({
    mutationFn: createItem,
    onSuccess: (data) => {
      addItem(data);
      queryClient.invalidateQueries({ queryKey: ['items'] });
    },
  });
}
```

---

## Realtime Synchronization

### Realtime Store Updates

```typescript
// Subscribe to realtime updates
useEffect(() => {
  const channel = subscribeToTable('items', '*', (payload) => {
    const { eventType, new: newData, old: oldData } = payload;
    
    if (eventType === 'INSERT') {
      useMyStore.getState().addItem(newData);
    } else if (eventType === 'UPDATE') {
      useMyStore.getState().updateItem(newData.id, newData);
    } else if (eventType === 'DELETE') {
      useMyStore.getState().deleteItem(oldData.id);
    }
  });
  
  return () => {
    channel.unsubscribe();
  };
}, []);
```

### Conflict Resolution Integration

```typescript
import { 
  ConflictDetector, 
  ConflictResolver,
  VectorClockManager 
} from '@/lib/realtime/conflict-resolution';

// Handle concurrent updates
const handleRealtimeUpdate = (remoteData: VersionedData<Item>) => {
  const localData = useMyStore.getState().currentItem;
  
  if (!localData) {
    // No local data, just apply remote
    useMyStore.getState().updateItem(remoteData.data.id, remoteData.data);
    return;
  }
  
  // Detect conflicts
  const conflict = ConflictDetector.detect(
    {
      data: localData,
      version: localData.version,
      timestamp: localData.updatedAt,
      userId: currentUserId,
    },
    remoteData
  );
  
  if (conflict.conflictType === 'none') {
    // No conflict, apply update
    useMyStore.getState().updateItem(remoteData.data.id, remoteData.data);
  } else {
    // Conflict detected, resolve automatically or show UI
    const resolved = ConflictResolver.auto(conflict);
    
    if (resolved.conflicts.length > 0) {
      // Show conflict resolution UI
      showConflictModal(conflict);
    } else {
      // Auto-resolved, apply
      useMyStore.getState().updateItem(resolved.data.id, resolved.data);
    }
  }
};
```

---

## State Synchronization Patterns

### Optimistic Updates

```typescript
const updateMutation = useMutation({
  mutationFn: updateItem,
  onMutate: async (newItem) => {
    // Optimistically update store
    useMyStore.getState().updateItem(newItem.id, newItem);
    
    // Return rollback data
    return { previousItem: useMyStore.getState().currentItem };
  },
  onError: (err, newItem, context) => {
    // Rollback on error
    if (context?.previousItem) {
      useMyStore.getState().updateItem(
        context.previousItem.id,
        context.previousItem
      );
    }
  },
  onSettled: () => {
    // Refetch to ensure consistency
    queryClient.invalidateQueries({ queryKey: ['items'] });
  },
});
```

### Debounced Updates

```typescript
import { debounce } from 'lodash';

const debouncedUpdate = debounce((id: string, updates: Partial<Item>) => {
  updateMutation.mutate({ id, updates });
}, 500);

// In component
const handleChange = (field: string, value: any) => {
  // Update store immediately (optimistic)
  useMyStore.getState().updateItem(itemId, { [field]: value });
  
  // Debounce server update
  debouncedUpdate(itemId, { [field]: value });
};
```

---

## Performance Optimization

### Selector Pattern

```typescript
// Bad: Re-renders on any store change
const items = useMyStore((state) => state.items);

// Good: Only re-renders when items change
const items = useMyStore(
  useCallback((state) => state.items, [])
);

// Better: Use shallow equality
import { shallow } from 'zustand/shallow';

const { items, filters } = useMyStore(
  (state) => ({ items: state.items, filters: state.filters }),
  shallow
);
```

### Computed Values

```typescript
// Add computed getters to store
export const useMyStore = create<MyState>()((set, get) => ({
  items: [],
  
  // Computed
  getFilteredItems: () => {
    const { items, filters } = get();
    return items.filter(item => {
      // Apply filters
      return true;
    });
  },
  
  getTotalCount: () => get().items.length,
}));
```

---

## Testing Strategies

### Store Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useMyStore } from './myStore';

describe('MyStore', () => {
  beforeEach(() => {
    useMyStore.getState().reset();
  });
  
  it('should add item', () => {
    const { result } = renderHook(() => useMyStore());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Test' });
    });
    
    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].name).toBe('Test');
  });
  
  it('should update item', () => {
    const { result } = renderHook(() => useMyStore());
    
    act(() => {
      result.current.addItem({ id: '1', name: 'Test' });
      result.current.updateItem('1', { name: 'Updated' });
    });
    
    expect(result.current.items[0].name).toBe('Updated');
  });
});
```

---

## Migration Guide

### Adding a New Store

1. Create store file in appropriate directory
2. Follow standard structure template
3. Add to `src/lib/stores/index.ts` exports
4. Create corresponding React Query hooks
5. Add tests
6. Document in this file

### Modifying Existing Store

1. Update store interface
2. Implement migration if persisted
3. Update all consumers
4. Update tests
5. Bump cache version if needed

---

## Best Practices

### DO

✅ Use Zustand for client-side UI state
✅ Use React Query for server state
✅ Implement reset() method in all stores
✅ Use devtools middleware in development
✅ Persist only necessary data
✅ Use selectors to prevent unnecessary re-renders
✅ Handle errors gracefully
✅ Implement optimistic updates for better UX

### DON'T

❌ Store server data in Zustand (use React Query)
❌ Persist sensitive data in localStorage
❌ Create stores for every component
❌ Forget to clean up subscriptions
❌ Mutate state directly (always use set)
❌ Store large datasets in Zustand
❌ Skip error handling

---

## Troubleshooting

### Common Issues

**Issue**: Store not persisting
- Check persistence configuration
- Verify localStorage is available
- Check for quota exceeded errors

**Issue**: Stale data in store
- Implement proper cache invalidation
- Use React Query for server state
- Add realtime subscriptions

**Issue**: Too many re-renders
- Use selectors properly
- Implement shallow equality checks
- Memoize computed values

**Issue**: Memory leaks
- Clean up subscriptions in useEffect
- Reset stores on unmount
- Remove event listeners

---

## Future Improvements

1. **State Machine Integration**: XState for complex workflows
2. **Time Travel Debugging**: Redux DevTools integration
3. **State Snapshots**: Save/restore application state
4. **Cross-Tab Sync**: BroadcastChannel API
5. **State Compression**: Reduce localStorage usage
6. **Atomic Updates**: Transaction-like state updates
