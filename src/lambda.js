/**
 * AWS Lambda entry point for Express.
 *
 * We wrap the Express app using serverless-express so API Gateway (HTTP API) can invoke it.
 *
 * Note: The serverless-express examples for API Gateway v2 show importing your app and exporting a handler.
 */
import serverlessExpress from '@codegenie/serverless-express';
import { ensureEnv } from '#utils/env';
import { createApp } from './createApp.js';
import { createRepos } from '#repositories/index';
import { prisma } from './db/prisma.js';

const env = ensureEnv();

const repos = await createRepos(prisma);

// The main app
const app = await createApp({
  repos,
  config: { JWT_SECRET: env.JWT_SECRET },
});

const handlerFn = serverlessExpress({ app });

export async function handler(event, context) {
  return handlerFn(event, context);
}

/**
 * Graceful shutdown closes DB connections.
 */
async function shutdown() {
  await prisma.$disconnect();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
