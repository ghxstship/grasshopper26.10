#!/bin/bash

# Fix all CompvssService files to extend BaseService and add CRUD methods

for file in $(find src/lib/services/compvss -name "*.ts" -type f); do
  if grep -q "export class CompvssService {" "$file" && grep -q "async execute(data: any)" "$file"; then
    echo "Fixing: $file"
    
    # Create temp file with the fix
    cat > "$file" << 'EOF'
import { BaseService } from '../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * CompvssService
 * Business logic for COMPVSS operations
 */

export class CompvssService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.advancingRequest.findMany(filters);
  }

  async findById(params: any) {
    return await prisma.advancingRequest.findUnique(params);
  }

  async create(params: any) {
    return await prisma.advancingRequest.create(params);
  }

  async update(params: any) {
    return await prisma.advancingRequest.update(params);
  }

  async delete(params: any) {
    return await prisma.advancingRequest.delete(params);
  }

  async execute(data: any) {
    return data;
  }
}
EOF
  fi
done

echo "Done fixing CompvssService files"
