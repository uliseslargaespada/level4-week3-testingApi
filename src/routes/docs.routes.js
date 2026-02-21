/**
 * Swagger (OpenAPI) documentation routes.
 *
 * This module loads docs/openapi.yaml and serves interactive Swagger UI at /api-docs.
 * Swagger UI is generated from an OpenAPI spec. :contentReference[oaicite:6]{index=6}
 */
import { Router } from 'express';
import path from 'path';
import fs from 'fs';
import YAML from 'yaml';
import swaggerUi from 'swagger-ui-express';


/**
 * Loads and parses the OpenAPI YAML file.
 * Keeping the spec in /docs makes it easy to locate, validate, and version-control.
 *
 * @returns {object} Parsed OpenAPI document as a JS object.
 */
function loadOpenApiSpec() {
  const filePath = path.resolve(process.cwd(), 'docs', 'openapi.yaml');
  const raw = fs.readFileSync(filePath, 'utf8');
  return YAML.parse(raw);
}

/**
 * Creates an Express router that serves:
 * - /api-docs (Swagger UI)
 * - /api-docs/openapi.json (raw JSON spec)
 *
 * @param {{ enabled?: boolean }} options
 */
export function createDocsRouter(options = {}) {
  const { enabled = true } = options;

  const router = Router();

  if (!enabled) {
    // If docs disabled, expose nothing (or return 404).
    return router;
  }

  const spec = loadOpenApiSpec();

  // Serve raw spec JSON (useful for tooling, importing in Postman, etc.)
  router.get('/openapi.json', (req, res) => res.json(spec));

  // Serve Swagger UI
  router.use('/', swaggerUi.serve, swaggerUi.setup(spec, { explorer: true }));

  return router;
}