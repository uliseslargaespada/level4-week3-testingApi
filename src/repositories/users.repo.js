/**
 * Users repository backed by Prisma.
 *
 * Responsibility:
 * - Minimal DB access for users.
 * - No HTTP concerns here (no res objects, no status codes).
 *
 * @param {import('@prisma/client').PrismaClient} prisma
 */
export function createUsersRepo(prisma) {
  return {
    /**
     * Create a user.
     *
     * @param {{ email: string, name: string, passwordHash: string }} data
     */
    async create(data) {
      return prisma.user.create({ data });
    },

    /**
     * Find a user by email.
     *
     * @param {string} email
     */
    async findByEmail(email) {
      console.log('Finding user by email:', email);

      console.log('Prisma client instance:', prisma.user);

      return prisma.user.findUnique({ where: { email } });
    },

    /**
     * Find a user by id.
     *
     * @param {string} id
     */
    async findById(id) {
      return prisma.user.findUnique({ where: { id } });
    },

    /**
     * List users with pagination.
     *
     * @param {{ limit?: number, offset?: number }} params
     */
    async list(params) {
      const { limit = 10, offset = 0 } = params;

      const [users, total] = await Promise.all([
        prisma.user.findMany({
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
          skip: offset,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.user.count(),
      ]);

      return { users, total };
    },
  };
}
