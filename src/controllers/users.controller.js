import { forbidden, notFound } from '#utils/httpErrors';
import { parsePagination } from '#utils/pagination';

/**
 * GET /users
 */
export async function getCurrentUser(req, res) {
  const { users } = res.locals.repos;

  const { limit, offset } = parsePagination(req.query);

  const result = await users.list({ limit, offset });

  return res.ok(result);
}

/**
 * GET /users/me
 */
export async function getMe(req, res) {
  const { users } = res.locals.repos;

  const userId = req.user?.id;

  const user = await users.findById(userId);

  if (!user) {
    throw notFound('User not found');
  }

  if(user.id !== userId) {
    throw forbidden('You are not allowed to access this resource');
  }

  return res.ok(user);
}
