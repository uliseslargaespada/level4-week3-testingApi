/**
 * Todos repository backed by prisma
 *
 * Responsible for managing CRUD operations for Todo entities.
 */

export function createTodosRepo(prisma) {
  return {
    async createTodo(data) {
      return prisma.todo.create({ data });
    },

    async getTodoById(id) {
      return prisma.todo.findUnique({ where: { id } });
    },

    async updateTodo(id, data) {
      return prisma.todo.update({ where: { id }, data });
    },

    async deleteTodo(id) {
      return prisma.todo.delete({ where: { id } });
    },

    async getAllTodos(params) {
      const { limit = 10, offset = 0 } = params || {};

      const [todos, total] = await Promise.all([
        prisma.todo.findMany({
          take: limit,
          skip: offset,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.todo.count(),
      ]);

      return { todos, total };
    },
  };
}
