export const base44 = {
  entities: {
    Character: {
      list: async () => [],
      get: async (id) => null,
      create: async (data) => data,
      update: async (id, data) => data,
      delete: async (id) => true,
    }
  }
};
