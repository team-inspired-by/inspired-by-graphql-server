"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "User",
    embedded: false
  },
  {
    name: "Post",
    embedded: false
  },
  {
    name: "GitPost",
    embedded: false
  },
  {
    name: "BookPost",
    embedded: false
  },
  {
    name: "Contributor",
    embedded: false
  },
  {
    name: "Series",
    embedded: false
  },
  {
    name: "Comment",
    embedded: false
  },
  {
    name: "Topic",
    embedded: false
  },
  {
    name: "Event",
    embedded: false
  },
  {
    name: "File",
    embedded: false
  },
  {
    name: "Category",
    embedded: false
  },
  {
    name: "UserType",
    embedded: false
  },
  {
    name: "levelType",
    embedded: false
  },
  {
    name: "LinkedStore",
    embedded: false
  },
  {
    name: "ContributorType",
    embedded: false
  },
  {
    name: "FileType",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466/inspiredBy/dev`
});
exports.prisma = new exports.Prisma();
