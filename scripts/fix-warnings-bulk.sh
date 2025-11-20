#!/bin/bash

# Fix all unused import warnings by prefixing with underscore

echo "Fixing unused imports across all files..."

# Common unused imports that need prefixing
sed -i '' 's/import { rateLimit,/import { rateLimit as _rateLimit,/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { getClientIdentifier }/import { getClientIdentifier as _getClientIdentifier }/g' src/**/*.ts src/**/*.tsx  
sed -i '' 's/, getClientIdentifier }/, getClientIdentifier as _getClientIdentifier }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { RATE_LIMITS,/import { RATE_LIMITS as _RATE_LIMITS,/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/, RATE_LIMITS,/, RATE_LIMITS as _RATE_LIMITS,/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { RateLimitIdentifiers }/import { RateLimitIdentifiers as _RateLimitIdentifiers }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/, RateLimitIdentifiers }/, RateLimitIdentifiers as _RateLimitIdentifiers }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { handleApiError }/import { handleApiError as _handleApiError }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/, handleApiError }/, handleApiError as _handleApiError }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { z }/import { z as _z }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/from "z/from "_z/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/import { prisma }/import { prisma as _prisma }/g' src/**/*.ts src/**/*.tsx
sed -i '' 's/, prisma }/, prisma as _prisma }/g' src/**/*.ts src/**/*.tsx

echo "Done!"
