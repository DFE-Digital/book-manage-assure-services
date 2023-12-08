module.exports = {
    base: () => ({
      table: () => ({
        select: () => ({
          firstPage: () => Promise.resolve([{ id: '123', fields: { ... } }]), // Mock response
        }),
      }),
    }),
  };
  