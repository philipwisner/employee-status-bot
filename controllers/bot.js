//CREATE SLACK API
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);
const bot = {};

//MESSAGE WHEN SERVER STARTS
bot.connect = (req, res) => {
  res.json(`Connected on port ${process.env.PORT}`);
}

//RESPONDS TO SPECIFIC MESSAGES
bot.bot_message = function(req, res) {
  let messageType = req.body.event.subtype;
  if (messageType == "message_deleted" || messageType == "bot_message") {
    return;
  }
  let type = req.body.event.type;
  let message = req.body.event.text.toLowerCase();
  let channelId = req.body.event.channel;
  let response;

  if (type === "message") {
    switch (message) {
      case "hi":
        response = "Hi how are you?";
        break;
      case "help":
        response = "Try typing *hi* or *update status*";
        break;
      case "update status":
        response = "Working on that";
        break;
      case "stuart":
        response = "http://gph.is/1eSfnUL";
        break;
      default:
        response = "Type help to see what commands you can use";
    }

    (async () => {
      console.log("inside async");
      const test = await web.chat.postMessage({
        text: response,
        reply_broadcast: false,
        as_user: false,
        username: "Status Bot",
        channel: channelId
      });
    })();
    res.json();
  } else {
    return;
  }
};


module.exports = bot
