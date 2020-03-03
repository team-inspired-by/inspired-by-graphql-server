const fetch = require('node-fetch')
const axios = require('axios');
const fs = require('fs')

const findBy = (value, array, field='id') =>
	array[array.map(item=>item[field]).indexOf(value)]


const requestGithubToken = async credentials => {
  const host = 'https://github.com/login/oauth/access_token?';
  const res = await axios.post(host, {
    client_id: credentials.client_id,
    client_secret: credentials.client_secret,
    code: credentials.code,
  }).then((res) => {
    return res.data;
  });
  const tmp = res.split('&')[0];
  const access_token = tmp.split('=')[1];
  return access_token;      
};

const requestGithubUserAccount = async (token) => {
  const config = {
    headers: {
      Authorization: `token ${token}`,
      'User-Agent': 'node-graphql-server'
    }
  };
  const res = await axios.get(`https://api.github.com/user`, config);
  return res.data;
}
    
        
const authorizeWithGithub = async credentials => {
    const access_token = await requestGithubToken(credentials)
    // const githubUser = await requestGithubUserAccount(access_token)
    return { access_token }
}

const uploadStream = (stream, path) => 
    new Promise((resolve, reject) => {
        stream.on('error', error => {
            if (stream.truncated) {
                fs.unlinkSync(path)
            }
            reject(error)
        }).on('end', resolve)
        .pipe(fs.createWriteStream(path))
    })

module.exports = {findBy, requestGithubToken, uploadStream}