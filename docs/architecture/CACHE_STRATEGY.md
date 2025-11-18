# Cache Strategy & State Management

**Last Updated:** November 16, 2025

## Overview

This document defines the caching and state management strategy for the Grasshopper platform, covering React Query cache configuration, Zustand store persistence, and cache invalidation patterns.

---

## React Query Cache Configuration

### Default Settings

```typescript
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      retry: 3,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      retry: 1,
    },
  },
});
```

### Cache Time by Data Type

| Data Type | Stale Time | Cache Time | Refetch on Focus | Notes |
|-----------|------------|------------|------------------|-------|
| **User Profile** | 10 min | 30 min | Yes | Changes infrequently |
| **Events** | 5 min | 15 min | Yes | Moderate update frequency |
| **Tickets** | 2 min | 10 min | Yes | High update frequency |
| **Cart** | 1 min | 5 min | Yes | Real-time critical |
| **Orders** | 5 min | 20 min | No | Historical data |
| **Analytics** | 15 min | 60 min | No | Expensive queries |
| **Static Data** | 24 hours | 48 hours | No | Rarely changes |
| **Realtime Data** | 0 | 1 min | Yes | Always fresh |

### Query Key Patterns

```typescript
// Entity lists
['events'] // All events
['events', { status: 'active' }] // Filtered events
['events', { page: 1, limit: 20 }] // Paginated events

// Single entities
['event', eventId] // Single event
['event', eventId, 'tickets'] // Event's tickets
['event', eventId, 'analytics'] // Event's analytics

// User-specific
['user', userId, 'profile']
['user', userId, 'orders']
['user', userId, 'wishlist']

// Nested resources
['project', projectId, 'tasks']
['project', projectId, 'tasks', { status: 'active' }]
```

---

## Cache Invalidation Patterns

### Automatic Invalidation

```typescript
// After mutation, invalidate related queries
const createEventMutation = useMutation({
  mutationFn: createEvent,
  onSuccess: () => {
    // Invalidate list
    queryClient.invalidateQueries({ queryKey: ['events'] });
    
    // Invalidate user's events
    queryClient.invalidateQueries({ 
      queryKey: ['user', userId, 'events'] 
    });
  },
});

const updateEventMutation = useMutation({
  mutationFn: updateEvent,
  onSuccess: (data) => {
    // Invalidate specific event
    queryClient.invalidateQueries({ 
      queryKey: ['event', data.id] 
    });
    
    // Invalidate list
    queryClient.invalidateQueries({ queryKey: ['events'] });
  },
});

const deleteEventMutation = useMutation({
  mutationFn: deleteEvent,
  onSuccess: (_, eventId) => {
    // Remove from cache
    queryClient.removeQueries({ 
      queryKey: ['event', eventId] 
    });
    
    // Invalidate list
    queryClient.invalidateQueries({ queryKey: ['events'] });
  },
});
```

### Optimistic Updates

```typescript
const updateTaskMutation = useMutation({
  mutationFn: updateTask,
  onMutate: async (newTask) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ 
      queryKey: ['task', newTask.id] 
    });

    // Snapshot previous value
    const previousTask = queryClient.getQueryData(['task', newTask.id]);

    // Optimistically update
    queryClient.setQueryData(['task', newTask.id], newTask);

    // Return context with snapshot
    return { previousTask };
  },
  onError: (err, newTask, context) => {
    // Rollback on error
    queryClient.setQueryData(
      ['task', newTask.id],
      context?.previousTask
    );
  },
  onSettled: (data) => {
    // Refetch after mutation
    queryClient.invalidateQueries({ 
      queryKey: ['task', data?.id] 
    });
  },
});
```

### Prefetching

```typescript
// Prefetch on hover
const prefetchEvent = (eventId: string) => {
  queryClient.prefetchQuery({
    queryKey: ['event', eventId],
    queryFn: () => fetchEvent(eventId),
    staleTime: 5 * 60 * 1000,
  });
};

// Prefetch next page
const prefetchNextPage = (currentPage: number) => {
  queryClient.prefetchQuery({
    queryKey: ['events', { page: currentPage + 1 }],
    queryFn: () => fetchEvents({ page: currentPage + 1 }),
  });
};
```

---

## Zustand Store Persistence

### Persistence Configuration

```typescript
// Full persistence (cart, wishlist)
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'cart-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

// Partial persistence (UI preferences only)
export const useUIStore = create<UIState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        theme: state.theme,
        sidebarCollapsed: state.sidebarCollapsed,
      }),
    }
  )
);

// No persistence (temporary state)
export const useSearchStore = create<SearchState>()((set, get) => ({
  // ... store implementation
}));
```

### Persistence Strategy by Store

| Store | Persistence | Storage | Reason |
|-------|-------------|---------|--------|
| **Cart** | Full | localStorage | Preserve across sessions |
| **Wishlist** | Full | localStorage | Preserve across sessions |
| **UI** | Partial | localStorage | Theme, layout preferences |
| **Filters** | Partial | sessionStorage | Preserve during session |
| **Search** | None | - | Temporary state |
| **Notifications** | None | - | Fetched from server |
| **Realtime** | None | - | Live data |

### State Hydration

```typescript
// Hydrate on mount
useEffect(() => {
  const hydrate = async () => {
    // Restore from localStorage
    const stored = localStorage.getItem('cart-storage');
    if (stored) {
      const { state } = JSON.parse(stored);
      useCartStore.setState(state);
    }
    
    // Validate and sync with server
    const serverCart = await fetchCart();
    useCartStore.getState().syncWithServer(serverCart);
  };
  
  hydrate();
}, []);
```

---

## Cache Warming

### Critical Data Prefetching

```typescript
// On app load
export async function warmCache(queryClient: QueryClient, userId: string) {
  await Promise.all([
    // User data
    queryClient.prefetchQuery({
      queryKey: ['user', userId, 'profile'],
      queryFn: () => fetchUserProfile(userId),
    }),
    
    // Active events
    queryClient.prefetchQuery({
      queryKey: ['events', { status: 'active' }],
      queryFn: () => fetchEvents({ status: 'active' }),
    }),
    
    // User's cart
    queryClient.prefetchQuery({
      queryKey: ['user', userId, 'cart'],
      queryFn: () => fetchCart(userId),
    }),
  ]);
}
```

---

## Cache Monitoring

### Metrics to Track

1. **Cache Hit Rate**: Percentage of queries served from cache
2. **Cache Size**: Total memory used by cache
3. **Stale Queries**: Number of stale queries in cache
4. **Refetch Rate**: How often queries are refetched
5. **Invalidation Rate**: How often cache is invalidated

### Monitoring Implementation

```typescript
// Track cache metrics
const cacheMetrics = {
  hits: 0,
  misses: 0,
  invalidations: 0,
  refetches: 0,
};

queryClient.setDefaultOptions({
  queries: {
    onSuccess: () => {
      cacheMetrics.hits++;
    },
    onError: () => {
      cacheMetrics.misses++;
    },
  },
});

// Log metrics periodically
setInterval(() => {
  console.log('Cache Metrics:', {
    hitRate: (cacheMetrics.hits / (cacheMetrics.hits + cacheMetrics.misses)) * 100,
    ...cacheMetrics,
  });
}, 60000); // Every minute
```

---

## Cache Versioning

### Version Strategy

```typescript
const CACHE_VERSION = 'v1';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      // ... store implementation
    }),
    {
      name: `cart-storage-${CACHE_VERSION}`,
      version: 1,
      migrate: (persistedState: any, version: number) => {
        if (version === 0) {
          // Migrate from v0 to v1
          return {
            ...persistedState,
            // Add new fields, transform data
          };
        }
        return persistedState;
      },
    }
  )
);
```

---

## Best Practices

### DO

✅ Use appropriate stale times based on data volatility
✅ Implement optimistic updates for better UX
✅ Prefetch data on user intent (hover, navigation)
✅ Invalidate related queries after mutations
✅ Use query key patterns consistently
✅ Monitor cache performance
✅ Version your cache for migrations

### DON'T

❌ Set staleTime to 0 for all queries (defeats caching)
❌ Over-invalidate (causes unnecessary refetches)
❌ Store sensitive data in localStorage
❌ Persist large datasets in Zustand
❌ Forget to handle cache hydration errors
❌ Use random query keys (breaks caching)

---

## Troubleshooting

### Common Issues

**Issue**: Stale data displayed to users
- **Solution**: Reduce staleTime or enable refetchOnWindowFocus

**Issue**: Too many refetches
- **Solution**: Increase staleTime, disable refetchOnWindowFocus for stable data

**Issue**: Cache growing too large
- **Solution**: Reduce cacheTime, implement cache size limits

**Issue**: Optimistic updates not rolling back
- **Solution**: Ensure onError handler restores previous state

**Issue**: Hydration errors
- **Solution**: Add version migration, validate persisted state

---

## Future Improvements

1. **Service Worker Caching**: Offline support with SW cache
2. **IndexedDB Storage**: For large datasets
3. **Cache Compression**: Reduce localStorage usage
4. **Smart Prefetching**: ML-based prediction of user intent
5. **Distributed Cache**: Redis for server-side caching
6. **Cache Analytics Dashboard**: Real-time monitoring UI
