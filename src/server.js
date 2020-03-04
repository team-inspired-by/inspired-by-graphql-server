import prisma from './prisma'; 
// const { ApolloServer, PubSub, AuthenticationError } = require('apollo-server');
import { GraphQLServer, PubSub, AuthenticationError } from 'graphql-yoga';
import { extractFragmentReplacements } from 'prisma-binding';
import { typeDefs, resolvers } from './schema';
const fragmentReplacements = extractFragmentReplacements(resolvers);
const pubsub = new PubSub();
const port = process.env.PORT || 4000;

const server = new GraphQLServer({
  typeDefs,
  resolvers,
  context({ req, res }) {
    return {
      req,
      res,
      prisma
    }
  },
  fragmentReplacements,
  playground: {
    endpoint: '/graphql',
    settings: {
      'request.credentials': 'include'
    }
  },
  plugins: [
    {
      requestDidStart(reqestContext) {
        return {
          willSendResponse(ctx) {
            const data = ctx.response.data ? ctx.response.data : '';
            if (data.authGithub || data.authGoogle){
              const github = data.authGithub ? true : false;
              
              if (github){
                ctx.response.http.headers.set('authorization', data.authGithub.token);
                console.log(ctx.response.http.headers);
              }else{
                //google
                ctx.response.http.headers.set('authorization', data.authGoogle.token);
                console.log(ctx.response.http.headers);
              }
            }
          }

        }
      }
    }
  ]

});

server.start(() => {
  console.log('The server is up!')
})
// server.listen(({port}) => console.log(`Server is running on http://localhost:4000`));
// server.listen({ port }).then(({ url }) => {
//   console.log(`Server ready at ${url}`)
// });



