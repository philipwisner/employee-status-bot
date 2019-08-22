//CREATE SLACK API
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);
const helper = require("../helper");

const status = {};

//RETURNS ALL USER'S NAMES AND STATUS FOR SN_DEVS CHANNEL
status.channel_status = (req, res) => {
  (async () => {
    const mems = await web.conversations.members({
      channel: "GDVTDFL4A"
    });

    let members = mems.members;
    let users = [];

    await members.forEach(async member => {
      users.push((helper.fetchUserStatus(member)));
    });

    Promise.all(users).then((users) => {
      console.log("users", users);
      res.json(users);
    })
  })();
};

module.exports = status;