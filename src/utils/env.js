/**
 * Loads and validates environment variables for the application.
 * This is intentionally small and explicit for teaching purposes.
 */
import dotenv from 'dotenv';

dotenv.config();

/**
 * @returns {{ PORT: number, JWT_SECRET: string, PRISMA_LOG_QUERIES: string, DATABASE_URL: string }}
 */
export function ensureEnv() {
  const PORT = Number(process.env.PORT ?? 3000);

  // Load the JWT variable
  const JWT_SECRET = process.env.JWT_SECRET ?? '';

  // Load the DB config
  const PRISMA_LOG_QUERIES = process.env.PRISMA_LOG_QUERIES ?? '';

  // Load the database URL
  const DATABASE_URL = process.env.DATABASE_URL ?? '';

  // Load the docs enable
  const DOCS_ENABLED = process.env.DOCS_ENABLED ?? 'true';

  if (!Number.isFinite(PORT) || PORT <= 0) {
    throw new Error('Invalid PORT. Please set PORT to a valid number.');
  }

  // Validation of the length of the key
  if (JWT_SECRET.trim().length < 31) {
    throw new Error('Invalid JWT_SECRET. Please set a long random string (32+ chars).');
  }

  if (DATABASE_URL.trim().length === 0) {
    throw new Error('Invalid DATABASE_URL. Please set a valid database connection string.');
  }

  if (DOCS_ENABLED !== 'true' && DOCS_ENABLED !== 'false') {
    throw new Error('Invalid DOCS_ENABLED. Please set DOCS_ENABLED to "true" or "false".');
  }

  return { PORT, JWT_SECRET, PRISMA_LOG_QUERIES, DATABASE_URL, DOCS_ENABLED };
}
