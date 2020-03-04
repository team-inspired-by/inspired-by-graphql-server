const auth = require('../../utils/auth');
module.exports = {
  Query: {


  },
  Mutation: {
    async createPost(root, args, { req, res, prisma }, info){
      const user = await auth.getUser(req);
      const data = args.input;
      const topics = { connect: [] };
      Promise.all(
        data.topics.map(t => {
          topics.connect.push({
            name: t
          })
        }));
      const inputData = {
        category: data.category,
        coverImg: data.coverImg,
        contents: data.contents,
        keywords: {
          set: data.keywords
        },
        summary: {
          set: data.summary
        },
        isPrivate: data.isPrivate,
        owner: {
          connect: {
            id: user.id
          }
        },
        topics: topics
      }
      if (auth.isManagerAuthenticated(user) || auth.isWriterAuthenticated(user)){
        return await prisma.mutation.createPost({
          data: inputData,  
        }, info);
      }
    },

    
  }

}