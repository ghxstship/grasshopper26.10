#!/bin/bash
# Script to reorganize app directory for optimal Next.js 13+ structure
# This creates a scalable, performant directory architecture

set -e

APP_DIR="/Users/julianclarkson/Documents/Grasshopper26.10/src/app"
REBUILD_DIR="$APP_DIR/(rebuild)"

echo "🚀 Starting app directory reorganization..."

# Create new route group directories
mkdir -p "$APP_DIR/(public)"
mkdir -p "$APP_DIR/(authenticated)"
mkdir -p "$APP_DIR/(platforms)/atlvs"
mkdir -p "$APP_DIR/(platforms)/compvss"
mkdir -p "$APP_DIR/(platforms)/gvteway"
mkdir -p "$APP_DIR/_lib"
mkdir -p "$APP_DIR/_config"

echo "✅ Created route group directories"

# Move public/marketing pages to (public) group
PUBLIC_PAGES=(
  "about"
  "blog"
  "careers"
  "contact"
  "press"
  "pricing"
  "privacy"
  "security"
  "terms"
)

for page in "${PUBLIC_PAGES[@]}"; do
  if [ -d "$REBUILD_DIR/$page" ]; then
    echo "Moving $page to (public)..."
    mv "$REBUILD_DIR/$page" "$APP_DIR/(public)/"
  fi
done

# Move auth pages to (public) - they're public but special
if [ -d "$REBUILD_DIR/auth" ]; then
  echo "Moving auth to (public)..."
  mv "$REBUILD_DIR/auth" "$APP_DIR/(public)/"
fi

# Move landing page to (public)
if [ -f "$REBUILD_DIR/page.tsx" ]; then
  echo "Moving landing page to (public)..."
  mv "$REBUILD_DIR/page.tsx" "$APP_DIR/(public)/"
fi

# Move authenticated user pages to (authenticated) group
AUTHENTICATED_PAGES=(
  "dashboard"
  "profile"
  "settings"
  "notifications"
  "orders"
  "wallet"
  "wishlist"
)

for page in "${AUTHENTICATED_PAGES[@]}"; do
  if [ -d "$REBUILD_DIR/$page" ]; then
    echo "Moving $page to (authenticated)..."
    mv "$REBUILD_DIR/$page" "$APP_DIR/(authenticated)/"
  fi
done

# Move GVTEWAY pages to (platforms)/gvteway
GVTEWAY_PAGES=(
  "events"
  "tickets"
  "adventures"
  "marketplace"
  "memberships"
  "cart"
  "checkout"
  "search"
  "social"
  "analytics"
)

for page in "${GVTEWAY_PAGES[@]}"; do
  if [ -d "$REBUILD_DIR/$page" ]; then
    echo "Moving $page to (platforms)/gvteway..."
    mv "$REBUILD_DIR/$page" "$APP_DIR/(platforms)/gvteway/"
  fi
done

# Move ATLVS pages to (platforms)/atlvs
if [ -d "$REBUILD_DIR/atlvs" ]; then
  echo "Moving ATLVS pages to (platforms)/atlvs..."
  # Move subdirectories
  for subdir in "$REBUILD_DIR/atlvs"/*; do
    if [ -d "$subdir" ]; then
      dirname=$(basename "$subdir")
      mv "$subdir" "$APP_DIR/(platforms)/atlvs/"
    fi
  done
  # Move page.tsx if exists
  if [ -f "$REBUILD_DIR/atlvs/page.tsx" ]; then
    mv "$REBUILD_DIR/atlvs/page.tsx" "$APP_DIR/(platforms)/atlvs/"
  fi
  # Remove empty atlvs dir
  rmdir "$REBUILD_DIR/atlvs" 2>/dev/null || true
fi

# Move COMPVSS pages to (platforms)/compvss
if [ -d "$REBUILD_DIR/compvss" ]; then
  echo "Moving COMPVSS pages to (platforms)/compvss..."
  # Move subdirectories
  for subdir in "$REBUILD_DIR/compvss"/*; do
    if [ -d "$subdir" ]; then
      dirname=$(basename "$subdir")
      mv "$subdir" "$APP_DIR/(platforms)/compvss/"
    fi
  done
  # Move page.tsx if exists
  if [ -f "$REBUILD_DIR/compvss/page.tsx" ]; then
    mv "$REBUILD_DIR/compvss/page.tsx" "$APP_DIR/(platforms)/compvss/"
  fi
  # Remove empty compvss dir
  rmdir "$REBUILD_DIR/compvss" 2>/dev/null || true
fi

# Move GVTEWAY platform page if exists
if [ -d "$REBUILD_DIR/gvteway" ]; then
  echo "Moving GVTEWAY platform page..."
  if [ -f "$REBUILD_DIR/gvteway/page.tsx" ]; then
    mv "$REBUILD_DIR/gvteway/page.tsx" "$APP_DIR/(platforms)/gvteway/"
  fi
  # Move any subdirectories
  for subdir in "$REBUILD_DIR/gvteway"/*; do
    if [ -d "$subdir" ]; then
      mv "$subdir" "$APP_DIR/(platforms)/gvteway/"
    fi
  done
  rmdir "$REBUILD_DIR/gvteway" 2>/dev/null || true
fi

# Move utility/dev routes to _lib (underscore prefix makes them non-routable)
UTILITY_DIRS=(
  "test"
  "placeholder"
  "batch"
)

for dir in "${UTILITY_DIRS[@]}"; do
  if [ -d "$APP_DIR/$dir" ]; then
    echo "Moving $dir to _lib..."
    mv "$APP_DIR/$dir" "$APP_DIR/_lib/"
  fi
done

# Move integration routes to _lib
INTEGRATION_DIRS=(
  "google-places"
  "integrations"
  "n8n"
  "shopify"
  "spotify"
  "sync"
  "upload"
)

for dir in "${INTEGRATION_DIRS[@]}"; do
  if [ -d "$APP_DIR/$dir" ]; then
    echo "Moving $dir to _lib..."
    mv "$APP_DIR/$dir" "$APP_DIR/_lib/"
  fi
done

# Clean up empty (rebuild) directory if it exists
if [ -d "$REBUILD_DIR" ]; then
  echo "Cleaning up (rebuild) directory..."
  rmdir "$REBUILD_DIR" 2>/dev/null || echo "⚠️  (rebuild) directory not empty, manual cleanup needed"
fi

echo "✨ App directory reorganization complete!"
echo ""
echo "📁 New structure:"
echo "  (public)/ - Marketing & auth pages"
echo "  (authenticated)/ - User dashboard & settings"
echo "  (platforms)/ - ATLVS, COMPVSS, GVTEWAY platforms"
echo "  api/ - API routes (unchanged)"
echo "  _lib/ - Utility & integration routes (non-routable)"
echo "  _config/ - Shared configs (non-routable)"
echo ""
echo "⚠️  Next steps:"
echo "  1. Update import paths in moved files"
echo "  2. Test all routes"
echo "  3. Run 'npm run build' to verify"
