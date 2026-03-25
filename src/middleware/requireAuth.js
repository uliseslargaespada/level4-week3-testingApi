import { unauthorized } from '#utils/httpErrors';
import { verifyToken } from '#utils/jwt';

/**
 * Requires a valid Bearer token.
 * Sets req.user = { id } on success.
 */
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization ?? '';
  const [scheme, token] = header.split(' ');

  if (scheme !== 'Bearer' || !token) {
    return next(unauthorized('Missing Bearer token'));
  }

  let payload;

  try {
    const secret = req.app.locals.config.JWT_SECRET;
    payload = verifyToken({ token, secret });
  } catch {
    return next(unauthorized('Invalid token'));
  }

  const isRevoked = await res.locals.repos.auth.isTokenRevoked(token);

  if (isRevoked) {
    return next(unauthorized('Token has been revoked'));
  }

  req.user = { id: payload.sub };
  req.auth = { token, payload };

  return next();
}
