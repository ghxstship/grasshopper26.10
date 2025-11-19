#!/bin/bash

# Fix all WebhooksService files to add batch methods

for file in $(find src/lib/services/webhooks -name "*.ts" -type f); do
  if grep -q "export class WebhooksService {" "$file"; then
    echo "Fixing: $file"
    
    # Determine the appropriate Prisma model based on the file path
    model="n8NWebhook"
    if [[ "$file" == *"/advancing.service.ts" ]]; then
      model="advancingRequest"
    elif [[ "$file" == *"/events.service.ts" ]]; then
      model="event"
    elif [[ "$file" == *"/tasks.service.ts" ]]; then
      model="task"
    elif [[ "$file" == *"/projects.service.ts" ]]; then
      model="project"
    elif [[ "$file" == *"/orders.service.ts" ]]; then
      model="order"
    elif [[ "$file" == *"/tickets.service.ts" ]]; then
      model="ticket"
    elif [[ "$file" == *"/sendgrid.service.ts" ]]; then
      model="notification"
    elif [[ "$file" == *"/stripe.service.ts" ]]; then
      model="order"
    elif [[ "$file" == *"/twilio.service.ts" ]]; then
      model="notification"
    fi
    
    # Create temp file with the fix
    cat > "$file" << EOF
import { BaseService } from '../../base/BaseService';
import { prisma } from '@/lib/prisma';

/**
 * WebhooksService
 * Business logic for webhook operations
 */

export class WebhooksService extends BaseService {
  async findAll(filters?: any) {
    return await prisma.${model}.findMany(filters);
  }

  async findById(id: string) {
    return await prisma.${model}.findUnique({ where: { id } });
  }

  async create(data: any) {
    return await prisma.${model}.create({ data });
  }

  async createMany(data: any) {
    return await prisma.${model}.createMany(data);
  }

  async update(id: string, data: any) {
    return await prisma.${model}.update({ where: { id }, data });
  }

  async updateMany(params: any) {
    return await prisma.${model}.updateMany(params);
  }

  async delete(id: string) {
    return await prisma.${model}.delete({ where: { id } });
  }

  async deleteMany(params: any) {
    return await prisma.${model}.deleteMany(params);
  }
}
EOF
  fi
done

echo "Done fixing WebhooksService files"
