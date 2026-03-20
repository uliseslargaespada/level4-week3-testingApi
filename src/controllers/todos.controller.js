import { badRequest, notFound } from '#utils/httpErrors';
import { parsePagination } from '#utils/pagination';

const TODO_FIELD_PARSERS = {
  text(value, { partial }) {
    if (value === undefined && partial) return undefined;
    if (typeof value !== 'string' || value.trim().length === 0) {
      throw badRequest('Todo text is required');
    }

    return value.trim();
  },

  isCompleted(value, { partial }) {
    if (value === undefined) return partial ? undefined : false;
    if (typeof value !== 'boolean') {
      throw badRequest('isCompleted must be a boolean');
    }

    return value;
  },
};

/**
 * GET /todos
 */
export async function getAllTodos(req, res) {
  const { todos } = res.locals.repos;
  const { limit, offset } = parsePagination(req.query);

  const result = await todos.getAllTodos({ limit, offset });

  return res.ok(result);
}

/**
 * GET /todos/:id
 */
export async function getTodoById(req, res) {
  const { todos } = res.locals.repos;
  const todoId = getTodoId(req.params.id);

  const todo = await todos.getTodoById(todoId);

  if (!todo) {
    throw notFound('Todo not found');
  }

  return res.ok(todo);
}

/**
 * POST /todos
 */
export async function createTodo(req, res) {
  const { todos } = res.locals.repos;
  const data = parseTodoPayload(req.body);

  const todo = await todos.createTodo(data);

  return res.created(todo);
}

/**
 * PATCH /todos/:id
 */
export async function updateTodo(req, res) {
  const { todos } = res.locals.repos;
  const todoId = getTodoId(req.params.id);
  const data = parseTodoPayload(req.body, { partial: true });

  const existingTodo = await todos.getTodoById(todoId);

  if (!existingTodo) {
    throw notFound('Todo not found');
  }

  const todo = await todos.updateTodo(todoId, data);

  return res.ok(todo);
}

/**
 * DELETE /todos/:id
 */
export async function deleteTodo(req, res) {
  const { todos } = res.locals.repos;
  const todoId = getTodoId(req.params.id);

  const existingTodo = await todos.getTodoById(todoId);

  if (!existingTodo) {
    throw notFound('Todo not found');
  }

  await todos.deleteTodo(todoId);

  return res.noContent();
}

/**
 * @param {unknown} rawId
 */
function getTodoId(rawId) {
  const todoId = String(rawId ?? '').trim();

  if (!todoId) {
    throw badRequest('Todo id is required');
  }

  return todoId;
}

/**
 * @param {Record<string, unknown>} body
 * @param {{ partial?: boolean }} [options]
 */
function parseTodoPayload(body, options = {}) {
  const { partial = false } = options;

  const payload = Object.entries(TODO_FIELD_PARSERS).reduce((acc, [field, parseField]) => {
    const parsedValue = parseField(body?.[field], { partial });

    return parsedValue === undefined ? acc : { ...acc, [field]: parsedValue };
  }, {});

  if (partial && Object.keys(payload).length === 0) {
    throw badRequest('At least one todo field is required');
  }

  return payload;
}
