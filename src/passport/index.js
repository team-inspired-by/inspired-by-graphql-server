const passport = require('passport');
// const FacebookTokenStrategy = require('passport-facebook-token');
const { Strategy: GoogleTokenStrategy } = require('passport-google-token');
const GitHubTokenStrategy = require('passport-github-token');
require('dotenv').config();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;

const GoogleTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

const GithubTokenStrategyCallback = (accessToken, refreshToken, profile, done) => done(null, {
  accessToken,
  refreshToken,
  profile,
});

passport.use(new GoogleTokenStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
}, GoogleTokenStrategyCallback));

passport.use(new GitHubTokenStrategy({
  clientID: GITHUB_CLIENT_ID,
  clientSecret: GITHUB_CLIENT_SECRET,
}, GithubTokenStrategyCallback));

const authenticateGithub = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('github-token', { session: false }, (err, data, info) => {
      if (err) reject(err);
      resolve({ data, info });
  })(req, res);
});

const authenticateGoogle = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('google-token', { session: false }, (err, data, info) => {
      if (err) reject(err);
      resolve({ data, info });
  })(req, res);
});

module.exports = { authenticateGithub, authenticateGoogle };