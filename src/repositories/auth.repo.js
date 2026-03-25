import { createHash } from 'node:crypto';

function hashToken(token) {
  return createHash('sha256').update(token).digest('hex');
}

export function createAuthRepo(prisma) {
  return {
    async revokeToken({ token, expiresAt, userId }) {
      const tokenHash = hashToken(token);

      return prisma.revokedToken.upsert({
        where: { tokenHash },
        update: {
          userId: userId ?? null,
          expiresAt,
          revokedAt: new Date(),
        },
        create: {
          tokenHash,
          userId: userId ?? null,
          expiresAt,
        },
      });
    },

    async isTokenRevoked(token) {
      const revokedToken = await prisma.revokedToken.findUnique({
        where: { tokenHash: hashToken(token) },
      });

      return Boolean(revokedToken && revokedToken.expiresAt > new Date());
    },
  };
}
