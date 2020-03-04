import auth from '../../utils/auth';
export default {
  Query: {
    async posts(root, args, { req, res, prisma }, info) {
      return prisma.query.posts({}, info);
    },
    

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
      return await prisma.mutation.createPost({
        data: inputData,  
      }, info);
      if (auth.isManagerAuthenticated(user) || auth.isWriterAuthenticated(user)){
        
      }
      throw new Error("Authentication Error");
    },
    async updatePost(root, args, { req, res, prisma }, info){
      // const user = auth.getUser(req);
      const { postInfo, data } = args;
      console.log(postInfo)
      console.log(data);
      return await prisma.mutation.updatePost({
        where: {
          id: postInfo.postId
        },
        data: data
      });
      // if (auth.isManagerAuthenticated(user) || postInfo.ownerId == user.id){
        
      // };
      throw new Error("Authentication Error");
    },
    async deletePost(root, args, { req, res, prisma }, info){
      const { postInfo } = args;
      const { ownerId, postId } = postInfo;
      
      return prisma.mutation.deletePost({
        where: {
          id: postId
        }
      });
      if (auth.isManagerAuthenticated(user) || ownerId == user.id){
        
      }
      throw new Error("Authentication Error");

    }


    
  }

}