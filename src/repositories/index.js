import { createUsersRepo } from './users.repo.js';

/**
 * Creates repositories (data layer).
 * For now, we'll return empty objects.
 * @param {import('@prisma/client').PrismaClient} prisma
 *
 * @returns {{ users: import('./users.repo.js').UsersRepo }}
 */
export async function createRepos(prisma) {

  return {
    users: createUsersRepo(prisma),
  };
}
