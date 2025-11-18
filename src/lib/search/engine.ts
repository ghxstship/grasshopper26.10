/**
 * Search Engine Implementation
 * Provides full-text search with relevance scoring
 */

import { prisma } from '@/lib/prisma';

export interface SearchOptions {
  query: string;
  type?: 'all' | 'event' | 'product' | 'task' | 'project' | 'user';
  limit?: number;
  offset?: number;
}

export interface SearchResult {
  id: string;
  type: string;
  title: string;
  description?: string;
  url: string;
  score: number;
  metadata?: Record<string, unknown>;
}

/**
 * Perform full-text search across all indexed content
 */
export async function search(options: SearchOptions): Promise<SearchResult[]> {
  const { query, type = 'all', limit = 20, offset = 0 } = options;
  
  if (!query || query.trim().length < 2) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();
  const results: SearchResult[] = [];

  // Search events
  if (type === 'all' || type === 'event') {
    const events = await prisma.event.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
          { location: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        description: true,
        location: true,
        startDate: true,
      },
    });

    events.forEach(event => {
      results.push({
        id: event.id,
        type: 'event',
        title: event.name,
        description: event.description || undefined,
        url: `/gvteway/events/${event.id}`,
        score: calculateRelevance(searchTerm, event.name, event.description),
        metadata: {
          location: event.location,
          startDate: event.startDate,
        },
      });
    });
  }

  // Search projects
  if (type === 'all' || type === 'project') {
    const projects = await prisma.project.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        description: true,
        status: true,
      },
    });

    projects.forEach(project => {
      results.push({
        id: project.id,
        type: 'project',
        title: project.name,
        description: project.description || undefined,
        url: `/atlvs/projects/${project.id}`,
        score: calculateRelevance(searchTerm, project.name, project.description),
        metadata: {
          status: project.status,
        },
      });
    });
  }

  // Search tasks
  if (type === 'all' || type === 'task') {
    const tasks = await prisma.task.findMany({
      where: {
        OR: [
          { title: { contains: searchTerm, mode: 'insensitive' } },
          { description: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
      },
    });

    tasks.forEach(task => {
      results.push({
        id: task.id,
        type: 'task',
        title: task.title,
        description: task.description || undefined,
        url: `/atlvs/tasks/${task.id}`,
        score: calculateRelevance(searchTerm, task.title, task.description),
        metadata: {
          status: task.status,
          priority: task.priority,
        },
      });
    });
  }

  // Search users
  if (type === 'all' || type === 'user') {
    const users = await prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: searchTerm, mode: 'insensitive' } },
          { email: { contains: searchTerm, mode: 'insensitive' } },
        ],
      },
      take: limit,
      skip: offset,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    users.forEach(user => {
      results.push({
        id: user.id,
        type: 'user',
        title: user.name || user.email,
        description: user.email,
        url: `/profile/${user.id}`,
        score: calculateRelevance(searchTerm, user.name, user.email),
        metadata: {
          role: user.role,
        },
      });
    });
  }

  // Sort by relevance score
  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

/**
 * Calculate relevance score for search results
 */
function calculateRelevance(
  query: string,
  title: string | null,
  description: string | null
): number {
  let score = 0;
  const queryLower = query.toLowerCase();
  const titleLower = (title || '').toLowerCase();
  const descLower = (description || '').toLowerCase();

  // Exact match in title = highest score
  if (titleLower === queryLower) {
    score += 100;
  }
  // Title starts with query
  else if (titleLower.startsWith(queryLower)) {
    score += 75;
  }
  // Title contains query
  else if (titleLower.includes(queryLower)) {
    score += 50;
  }

  // Description contains query
  if (descLower.includes(queryLower)) {
    score += 25;
  }

  // Boost for shorter titles (more specific)
  if (title && title.length < 50) {
    score += 10;
  }

  return score;
}

/**
 * Build search index for faster queries
 */
export async function buildSearchIndex(): Promise<void> {
  // In a production system, this would build a full-text search index
  // using PostgreSQL's tsvector or an external service like Elasticsearch
  console.log('Building search index...');
  
  // For now, we rely on Prisma's database indexes
  // Future: Implement tsvector columns and GIN indexes
}

/**
 * Get search suggestions based on partial query
 */
export async function getSuggestions(query: string, limit = 5): Promise<string[]> {
  if (!query || query.length < 2) {
    return [];
  }

  const searchTerm = query.trim().toLowerCase();
  const suggestions = new Set<string>();

  // Get event names
  const events = await prisma.event.findMany({
    where: {
      name: { contains: searchTerm, mode: 'insensitive' },
    },
    select: { name: true },
    take: limit,
  });
  events.forEach(e => suggestions.add(e.name));

  // Get project names
  const projects = await prisma.project.findMany({
    where: {
      name: { contains: searchTerm, mode: 'insensitive' },
    },
    select: { name: true },
    take: limit,
  });
  projects.forEach(p => suggestions.add(p.name));

  return Array.from(suggestions).slice(0, limit);
}
