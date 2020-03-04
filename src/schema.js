import {
  fileLoader,
  mergeResolvers,
  mergeTypes
} from "merge-graphql-schemas"
import path from "path"
import { makeExecutableSchema } from "graphql-tools"
import { resolve } from "dns";

// api 디렉토리 내부의 모든 폴더에 모든 graphql 파일을 불러온다
const allTypes = fileLoader(path.join(__dirname, "/api/**/*.graphql"));

// api 디렉토리 내부의 모든 폴더에 모든 js(resolver) 파일을 불러온다
const allResolvers = fileLoader(path.join(__dirname, "/api/**/*.js"));

// schema 변수에 typeDefs, resolvers를 정의해서 담아주고 export
// const schema = makeExecutableSchema({
  
// });

const typeDefs = mergeTypes(allTypes);
const resolvers = mergeResolvers(allResolvers);

module.exports = { typeDefs, resolvers }