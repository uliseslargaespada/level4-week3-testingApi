import { createAuthRepo } from './auth.repo.js';
import { createUsersRepo } from './users.repo.js';
import { createTodosRepo } from './todos.repo.js';

/**
 * Creates repositories (data layer).
 * For now, we'll return empty objects.
 * @param {import('@prisma/client').PrismaClient} prisma
 *
 * @returns {{ users: import('./users.repo.js').UsersRepo }}
 */
export async function createRepos(prisma) {
  return {
    auth: createAuthRepo(prisma),
    users: createUsersRepo(prisma),
    todos: createTodosRepo(prisma),
  };
}
