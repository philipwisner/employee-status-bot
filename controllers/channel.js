//CREATE SLACK API
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);

const channel = {};

//RETURNS ALL USER'S NAMES AND STATUS FOR SN_DEVS CHANNEL
channel.channel_list = (req, res) => {
  (async () => {
    const public = await web.conversations.list({
      exclude_archived: true,
      exclude_members: true,
      types: 'public_channel',
    });
    const private = await web.conversations.list({
      exclude_archived: true,
      exclude_members: true,
      types: "private_channel"
    });
    let channels = public.channels.concat(private.channels)
    return res.json(channels);
  })();
};

module.exports = channel;
