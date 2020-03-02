const jwt = require('jsonwebtoken');
const { authenticateGithub, authenticateGoogle } = require('../../passport');
require('dotenv').config();

module.exports =  {
  Query: {
    async users(parent, args, { prisma }, info) {
      const opArgs = {};
      const data = args.SocialUserInput;

      if (args.SocialUserInput) {
        opArgs.where = {
          AND: [{
            openId: data.openId
          },{
            userType: data.userType
          }]
        }
      };
      
      return prisma.query.users(opArgs, info);
    },
    async user(parent, args, { prisma }, info) {
      const opArgs = {};
      if (args.id){
        opArgs.where = {
          id: args.id
        }
      }
      return prisma.query.user(opArgs, info);
    },
    githubLoginUrl: () => {
      return `https://github.com/login/oauth/authorize?client_id=${
      process.env.GITHUB_CLIENT_ID
      }&scope=user`;
    },
    test(root, args, context){
      const { req, res } = context;
      const result = jwt.verify("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNGMxNDAzZTk1MDk2MzhiNGY3Mzc4YyIsImV4cCI6MTU4NzM4ODYwNywiaWF0IjoxNTgyMjA0NjA3fQ.MSGF01e9MZVCyZtpqPQu1ht1rnoYtpXKIlq_n_qFXkY", 'secret');
      console.log(result.id);
      const testUser = User.findOne({_id: result.id});
      console.log(testUser);
      return "adsf";
    }

  },
  Mutation: {
    async createUser(root, args, { prisma }, info){
      
      
      return await User.create(input);
    },
    
    async deleteUser(root, { id }){
      return await User.findOneAndDelete(id);
    },
    async githubAccessToken(parent, { code }, context) {
      const { req, res } = context;
      let access_token = await requestGithubToken({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code
      });
      return { token: access_token };
    },
    authGoogle: async(root, { input: { accessToken }}, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken
      };
      try{
        const { data, info } = await authenticateGoogle(req, res);
        if (data) {
          console.log(data);

          // const user = await User.upsertGoogleUser(data);
          // if (user) {
          //   const token = await user.generateJWT(user);
          //   return ({
          //     token: token,
          //     user: user,
          //   });
          // };

        }
        if (info) {
          console.log(info);
        }
        return (Error('server error'));
      }catch(err) {
        console.error(err);
      }

    },
    authGithub: async(root, { input: { accessToken }}, { req, res }) => {
      req.body = {
        ...req.body,
        access_token: accessToken
      };
      try{
        const { data, info } = await authenticateGithub(req, res);
        if (data) {
          const user = await User.upsertGithubUser(data);
          if (user) {
            const token = await user.generateJWT(user);
            return ({
              token: token,
              user: user,
            });
          }
        }

        if (info) {
          console.log(info);
        }
        return (Error('server error'));
      }catch(err) {
        console.error(err);
      }
    },

  }

}