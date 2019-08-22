const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);
const helper = {};

helper.fetchUserStatus = async function(userId) {
  const info = await web.users.profile.get({
    user: userId
  });
  let user = {
    name: info.profile.real_name,
    status: `${info.profile.status_emoji} ${info.profile.status_text}`
  };
  return user;
};

module.exports = helper;
