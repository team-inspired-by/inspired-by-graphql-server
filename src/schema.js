const {
  fileLoader,
  mergeResolvers,
  mergeTypes
} = require("merge-graphql-schemas");
const path = require("path");
const { makeExecutableSchema } = require("graphql-tools"); 

// api 디렉토리 내부의 모든 폴더에 모든 graphql 파일을 불러온다
const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"));

// api 디렉토리 내부의 모든 폴더에 모든 js(resolver) 파일을 불러온다
const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"));

// schema 변수에 typeDefs, resolvers를 정의해서 담아주고 export

const typeDefs = mergeTypes(allTypes);
const resolvers = mergeResolvers(allResolvers);

// const schema = makeExecutableSchema({
//   typeDefs: mergeTypes(allTypes),
//   resolvers: mergeResolvers(allResolvers)
// });

module.exports = { typeDefs, resolvers };