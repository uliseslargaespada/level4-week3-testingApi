import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { createErrorHandler } from '#middleware/errorHandler';
import { notFoundHandler } from '#middleware/notFoundHandler';
import { respond } from '#middleware/respond';

// Routers
import { authRouter } from '#routes/auth.routes';
import { usersRouter } from '#routes/users.route';

// Import the docs function
import { createDocsRouter } from '#routes/docs.routes';

// import env helper
import { ensureEnv } from '#utils/env';

/**
 * Factory that creates the Express app with injected dependencies.
 * This is the pattern that makes testing easy with Supertest.
 *
 * @param {{ repos: any, config?: object }} deps
 * @returns {import('express').Express}
 */
export async function createApp({ repos = {}, config = {} }) {
  // Load the needed variables 
  const { DOCS_ENABLED } = ensureEnv();

  // Express functions always return objects that have functionality built in
  // Initialize the app object that's returned from the Express function
  const app = express();

  app.locals.config = config;

  // Parse JSON request bodies
  app.use(express.json());

  // Security headers
  app.use(helmet());

  // Request logging (dev-friendly)
  app.use(morgan('dev'));

  // Response helpers (res.ok/res.created/etc)
  app.use(respond);

  // Health check endpoint
  app.get('/health', (_req, res) => {
    res.json({ status: 'ok', message: 'App is running correctly' });
  });

  // Attach repositories to res.locals so controllers can access them
  app.use((_req, res, next) => {
    res.locals.repos = repos;
    next();
  });

  app.use('/api-docs', await createDocsRouter({ enabled: DOCS_ENABLED === 'true' }));

  // Register routers
  app.use('/auth', authRouter);
  app.use('/users', usersRouter);

  // Caught not defined routes with a specific message
  app.use(notFoundHandler);

  // Error handling middleware must be last (4 args signature)
  // High order function is a function that returns the actual middleware so we can inject dependencies if needed in the future
  app.use(createErrorHandler());

  return app;
}
