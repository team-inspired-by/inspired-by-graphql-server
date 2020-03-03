const jwt = require('jsonwebtoken');
const { authenticateGithub, authenticateGoogle } = require('../../passport');
const { requestGithubToken } = require('../../lib');
const auth = require('../../utils/auth');
const utils = require('../../utils');
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
    test(parent, args, { req, res, prisma }, info){
      const user = auth.getUser(req);
      console.log(id);
      
      return user;
    }

  },
  Mutation: {
    async createUser(root, args, { prisma }, info){
      
      
      return await User.create(input);
    },
    
    async deleteUser(root, args, { req, res, prisma }, info){
      const user = auth.getUser(req);
      const deletedUserId = args.id;
      if (auth.isManagerAuthenticated(user) || deletedUserId == user.id){
        return prisma.mutation.deleteUser({
          where: {
            id: deletedUserId
          }
        })
      };
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
    authGoogle: async(root, { input: { accessToken }}, { req, res, prisma }, info) => {
      req.body = {
        ...req.body,
        access_token: accessToken
      };
      try{
        const { data, resultInfo } = await authenticateGoogle(req, res);
        if (data) {
          const { accessToken, refreshToken, profile } = data;
          let user = await prisma.query.user({
            where: {
              openId: profile.id
            }
          });
          if(!user){
            user = await prisma.mutation.createUser({
              data: {
                name: profile.displayName || `${profile.familyName} ${profile.givenName}`,
                level: 'MEMBER',
                profileImg: profile._json.picture,
                openId: profile.id,
                userType: 'GOOGLE',
                accessToken: accessToken,
                email: profile.emails[0].value,
              }
            });
          };
          const token = await auth.generateToken(user.id);
          return({
            token: token,
            user: user
          });

        };
        if (resultInfo) {
          return resultInfo;
        }
      }catch(err) {
        console.error(err);
        return err;
      }
    },
    authGithub: async(root, { input: { accessToken }}, { req, res, prisma }, info) => {
      req.body = {
        ...req.body,
        access_token: accessToken
      };
      try{
        const { data, resultInfo } = await authenticateGithub(req, res);
        if (data) {
          const { accessToken, refreshToken, profile } = data;
          let user = await prisma.query.user({
            where: {
              openId: profile.id.toString()
            }
          });
          if(!user){
            user = await prisma.mutation.createUser({
              data: {
                name: profile.displayName,
                alias: profile.username,
                level: 'MEMBER',
                profileImg: profile._json.avatar_url,
                openId: profile.id.toString(),
                userType: 'GITHUB',
                accessToken: accessToken,
                email: profile.emails[0].value,
              }
            });
          };
          const token = await auth.generateToken(user.id);
          return({
            token: token,
            user: user
          });

        };
        if (resultInfo) {
          return resultInfo;
        }
      }catch(err) {
        console.error(err);
        return err;
      }
    },

  }

}