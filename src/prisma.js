const { Prisma } = require('prisma-binding');
// const { fragmentReplacements } = require('./')

const prisma = new Prisma({
    typeDefs: 'src/generated/prisma.graphql',
    endpoint: 'http://localhost:4466/inspiredby/dev',
});

module.exports = prisma;
