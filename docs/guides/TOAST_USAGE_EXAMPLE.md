# Toast Component - Usage Guide

> **Complete guide for implementing toast notifications**

---

## Overview

The Toast component provides non-intrusive notification messages that automatically dismiss after a set duration. It includes a context provider for managing multiple toasts and supports all platform variants.

---

## Basic Setup

### 1. Wrap Your App with ToastProvider

```tsx
// app/layout.tsx or _app.tsx
import { ToastProvider } from '@/hooks/useToast';
import { ToastContainer, Toast } from '@/components/molecules/Toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <ToastProvider>
          {children}
          <ToastRenderer />
        </ToastProvider>
      </body>
    </html>
  );
}

// Create a ToastRenderer component
function ToastRenderer() {
  const { toasts, removeToast } = useToast();
  
  return (
    <ToastContainer position="top-right">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
          onClose={() => removeToast(toast.id)}
        />
      ))}
    </ToastContainer>
  );
}
```

---

## Using the Hook

### Success Toast

```tsx
import { useToast } from '@/hooks/useToast';

function MyComponent() {
  const { addToast } = useToast();

  const handleSave = () => {
    // Save logic...
    
    addToast({
      title: "Changes saved",
      description: "Your profile has been updated successfully.",
      variant: "success",
      duration: 5000,
    });
  };

  return <button onClick={handleSave}>Save</button>;
}
```

### Error Toast

```tsx
const handleError = () => {
  addToast({
    title: "Error occurred",
    description: "Failed to upload file. Please try again.",
    variant: "error",
    duration: 7000, // Longer duration for errors
  });
};
```

### Warning Toast

```tsx
const handleWarning = () => {
  addToast({
    title: "Warning",
    description: "You have unsaved changes.",
    variant: "warning",
    duration: 6000,
  });
};
```

### Info Toast

```tsx
const handleInfo = () => {
  addToast({
    title: "New update available",
    description: "Version 2.0 is now available for download.",
    variant: "info",
    duration: 5000,
  });
};
```

---

## Platform-Specific Toasts

### GVTEWAY Toast

```tsx
addToast({
  title: "Ticket purchased!",
  description: "Your tickets have been added to your wallet.",
  variant: "gvteway",
  duration: 5000,
});
```

### COMPVSS Toast

```tsx
addToast({
  title: "QR code scanned",
  description: "Guest checked in successfully.",
  variant: "compvss",
  duration: 4000,
});
```

### ATLVS Toast

```tsx
addToast({
  title: "Project created",
  description: "Summer Festival 2025 has been created.",
  variant: "atlvs",
  duration: 5000,
});
```

---

## Advanced Features

### Toast with Action Button

```tsx
addToast({
  title: "File uploaded",
  description: "Your document is ready to view.",
  variant: "success",
  action: {
    label: "View File",
    onClick: () => {
      router.push('/documents/123');
    },
  },
  duration: 8000,
});
```

### Custom Icon

```tsx
import { Rocket } from 'lucide-react';

addToast({
  title: "Launch successful!",
  description: "Your campaign is now live.",
  variant: "success",
  icon: <Rocket className="h-5 w-5 text-green-600" />,
  duration: 5000,
});
```

### Persistent Toast (No Auto-Dismiss)

```tsx
addToast({
  title: "Important notice",
  description: "Please review the new terms of service.",
  variant: "warning",
  duration: 0, // Won't auto-dismiss
});
```

---

## Multiple Toasts

The ToastProvider automatically stacks multiple toasts:

```tsx
const handleMultipleActions = async () => {
  addToast({
    title: "Processing...",
    variant: "info",
    duration: 2000,
  });

  await processData();

  addToast({
    title: "Data processed",
    variant: "success",
    duration: 3000,
  });

  await uploadData();

  addToast({
    title: "Upload complete",
    variant: "success",
    duration: 3000,
  });
};
```

---

## Position Options

Change the toast position globally:

```tsx
<ToastContainer position="bottom-right">
  {/* Toasts appear in bottom-right corner */}
</ToastContainer>

<ToastContainer position="top-center">
  {/* Toasts appear centered at top */}
</ToastContainer>
```

Available positions:
- `top-right` (default)
- `top-left`
- `bottom-right`
- `bottom-left`
- `top-center`
- `bottom-center`

---

## Real-World Examples

### Form Submission

```tsx
const handleSubmit = async (data: FormData) => {
  try {
    await submitForm(data);
    
    addToast({
      title: "Form submitted",
      description: "We'll get back to you within 24 hours.",
      variant: "success",
      duration: 5000,
    });
    
    router.push('/thank-you');
  } catch (error) {
    addToast({
      title: "Submission failed",
      description: error.message,
      variant: "error",
      duration: 7000,
    });
  }
};
```

### File Upload Progress

```tsx
const handleUpload = async (file: File) => {
  const toastId = addToast({
    title: "Uploading...",
    description: `${file.name} (0%)`,
    variant: "info",
    duration: 0, // Don't auto-dismiss
  });

  try {
    await uploadWithProgress(file, (progress) => {
      // Update toast description with progress
      // Note: This requires extending the hook to support updates
    });

    removeToast(toastId);
    
    addToast({
      title: "Upload complete",
      description: `${file.name} uploaded successfully.`,
      variant: "success",
      duration: 5000,
    });
  } catch (error) {
    removeToast(toastId);
    
    addToast({
      title: "Upload failed",
      description: error.message,
      variant: "error",
      duration: 7000,
    });
  }
};
```

### Undo Action

```tsx
const handleDelete = (itemId: string) => {
  const deletedItem = items.find(i => i.id === itemId);
  
  // Optimistically remove item
  setItems(items.filter(i => i.id !== itemId));
  
  addToast({
    title: "Item deleted",
    description: deletedItem.name,
    variant: "success",
    action: {
      label: "Undo",
      onClick: () => {
        // Restore item
        setItems([...items, deletedItem]);
        
        addToast({
          title: "Deletion undone",
          variant: "info",
          duration: 3000,
        });
      },
    },
    duration: 8000, // Give user time to undo
  });
};
```

### Network Status

```tsx
useEffect(() => {
  const handleOnline = () => {
    addToast({
      title: "Back online",
      description: "Your connection has been restored.",
      variant: "success",
      duration: 4000,
    });
  };

  const handleOffline = () => {
    addToast({
      title: "No connection",
      description: "You're currently offline. Changes will sync when reconnected.",
      variant: "warning",
      duration: 0, // Keep visible until back online
    });
  };

  window.addEventListener('online', handleOnline);
  window.addEventListener('offline', handleOffline);

  return () => {
    window.removeEventListener('online', handleOnline);
    window.removeEventListener('offline', handleOffline);
  };
}, []);
```

---

## Best Practices

### 1. Duration Guidelines
- **Success:** 3-5 seconds
- **Info:** 4-6 seconds
- **Warning:** 6-8 seconds
- **Error:** 7-10 seconds (users need time to read error details)
- **Critical:** 0 (no auto-dismiss, require manual close)

### 2. Message Content
- **Title:** Short, action-oriented (2-4 words)
- **Description:** Concise details (1-2 sentences max)
- **Action:** Clear verb ("View", "Undo", "Retry")

### 3. Avoid Toast Spam
```tsx
// ❌ Bad: Too many toasts
items.forEach(item => {
  addToast({ title: `Processed ${item.name}` });
});

// ✅ Good: Single summary toast
addToast({
  title: "Batch processing complete",
  description: `${items.length} items processed successfully.`,
  variant: "success",
});
```

### 4. Use Appropriate Variants
- **Success:** Completed actions, confirmations
- **Error:** Failed operations, validation errors
- **Warning:** Cautions, unsaved changes, deprecations
- **Info:** Updates, tips, neutral notifications

---

## Accessibility

The Toast component includes:
- ✅ ARIA live regions for screen readers
- ✅ Keyboard navigation (Tab to action/close)
- ✅ Focus management
- ✅ Semantic HTML
- ✅ Color contrast compliance

---

**Built with GHXSTSHIP precision ⚓️**
