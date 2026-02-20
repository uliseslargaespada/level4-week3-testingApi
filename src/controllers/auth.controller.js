import { conflict, unauthorized } from '#utils/httpErrors';
import { ensureBodyFields } from '#utils/guard';
import { hashPassword, verifyPassword } from '#utils/password';
import { signToken } from '#utils/jwt';

/**
 * POST /auth/register
 */
export async function registerUser(req, res) {
  const { users } = res.locals.repos;

  ensureBodyFields(req.body, ['email', 'firstName', 'password']);

  const email = String(req.body.email).toLowerCase().trim();
  const firstName = String(req.body.firstName).trim();
  const lastName = String(req.body.lastName).trim();
  const password = String(req.body.password);

  const userExists = await users.findByEmail(email);

  console.log('Found user:', userExists);

  if (userExists) {
    throw conflict('Email already registered');
  }

  const user = await users.create({
    email,
    firstName,
    lastName,
    passwordHash: hashPassword(password),
  });

  const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

  return res.created({
    token,
    user: { id: user.id, email: user.email, firstName: user.firstName, lastName: user.lastName },
  });
}

/**
 * POST /auth/login
 */
export async function loginUser(req, res) {
  const { users } = res.locals.repos;

  ensureBodyFields(req.body, ['email', 'password']);

  const email = String(req.body.email).toLowerCase().trim();
  const password = String(req.body.password);

  const user = await users.findByEmail(email);
  if (!user) {
    throw unauthorized('Invalid credentials');
  }

  if (!verifyPassword(password, user.passwordHash)) {
    throw unauthorized('Invalid credentials');
  }

  const token = signToken({ userId: user.id, secret: req.app.locals.config.JWT_SECRET });

  return res.ok({
    token,
    user: { id: user.id, email: user.email, name: user.name },
  });
}
