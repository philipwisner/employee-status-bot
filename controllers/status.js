//CREATE SLACK API
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);
const helper = require("../helpers/helper");

const status = {};

//RETURNS ALL USER'S NAMES AND STATUS FOR SN_DEVS CHANNEL
status.channel_status = (req, res) => {
  console.log('req', req.params)
  let channel = req.params.id;

  (async () => {
    const mems = await web.conversations.members({
      channel: channel
    });

    let members = mems.members;
    let users = [];

    await members.forEach(async member => {
      users.push((helper.fetchUserStatus(member)));
    });

    Promise.all(users).then((users) => {
      res.json(users);
    })
  })();
};

module.exports = status;