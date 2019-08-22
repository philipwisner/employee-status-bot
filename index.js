//DEPENDENCIES
const express = require("express");
const bodyParser = require("body-parser");
require("dotenv").config();

//IMPORTS
const helper = require("./helper/helper");

//CREATE SLACK API
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);

//CREATE APP
const app = express();

app.listen(process.env.PORT, function() {
  console.log("Bot is listening on port " + process.env.PORT);
});

//USE BODY PARSER
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());





//ROUTES
app.get("/", (req, res) => {
  res.json(`Connected on port ${process.env.PORT}`);
});

//RETURNS ALL USER'S NAMES AND STATUS FOR SN_DEVS CHANNEL
app.get("/status", (req, res) => {
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
})

//UPDATES USER'S STATUS BASED OFF SLASH COMMAND
app.post("/", (req, res) => {
  let command = req.body.command;
  let status, emoji, help;
  let userName = req.body.user_name;
  let userId = req.body.user_id;
  let channelId = req.body.channel_id;
  console.log(`${userName} has requested ${command}`);

  switch (command) {
    case "/options":
      help = true;
      break;
    case "/home":
      status = "Working from Home";
      emoji = ":house:";
      break;
    case "/office":
      status = "In the Office";
      emoji = ":office:";
      break;
    case "/vacation":
      status = "On Vacation";
      emoji = ":palm_tree:";
      break;
    case "/sick":
      status = "Out Sick";
      emoji = ":face_with_thermometer:";
      break;
    case "/late":
      status = "Running Late";
      emoji = ":runner:";
      break;
    case "/meeting":
      status = "In a Meeting";
      emoji = ":spiral_calendar_pad:";
      break;
    case "/fox":
      status = "Being a Fox";
      emoji = ":thefox:";
      break;
    case "/lunch":
      status = "Eating Lunch";
      emoji = ":pizza:";
      break;
    default:
      help = true;
  }

  (async () => {
    if (help) {
      const error = await web.chat.postEphemeral({
        attachments: [
          {
            text: "You can set your status using the following commands",
            actions: [
              {
                name: "status",
                text: "home",
                type: "button",
                value: "/home",
                action_id: "/home"
              },
              {
                name: "status",
                text: "office",
                type: "button",
                value: "/office"
              },
              {
                name: "status",
                text: "vacation",
                type: "button",
                value: "/vacation"
              },
              {
                name: "status",
                text: "sick",
                type: "button",
                value: "/sick"
              },
              {
                name: "status",
                text: "late",
                type: "button",
                value: "/late"
              },
              {
                name: "status",
                text: "meeting",
                type: "button",
                value: "/meeting"
              }
            ]
          }
        ],
        channel: channelId,
        //text: "You can set your status using the following commands",
        user: userId,
        reply_broadcast: false,
        as_user: false,
        username: "Status Bot"
      });
    } else {
      const result = await web.users.profile.set({
        profile: {
          status_text: status,
          status_emoji: emoji,
          status_expiration: 0
        }
      });

      const success = await web.chat.postEphemeral({
        attachments: [{ text: `${emoji} *${status}*` }],
        channel: channelId,
        text: "You changed your status to",
        user: userId,
        reply_broadcast: false,
        as_user: false,
        username: "Status Bot"
      });
    }
    res.json()
  })();
});

//BOT RESPONDS TO SPECIFIC MESSAGE IN A DM
app.post("/bot", (req, res) => {
  let messageType = req.body.event.subtype;
  if (messageType == 'message_deleted' || messageType == 'bot_message') {
    return;
  }
  let type = req.body.event.type;
  let message = req.body.event.text.toLowerCase();
  let channelId = req.body.event.channel;
  let response;

  if (type === 'message' ) {
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
      console.log('inside async')
      const test = await web.chat.postMessage({
        text: response,
        reply_broadcast: false,
        as_user: false,
        username: "Status Bot",
        channel: channelId
      });
    })()
    res.json();

  } else {
    return;
  }

});

