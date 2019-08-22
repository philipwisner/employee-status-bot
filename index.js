require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const { WebClient } = require("@slack/web-api");
const token = process.env.SLACK_AUTH_TOKEN;
const web = new WebClient(token);

const app = express();
const PORT = 3000;

app.listen(process.env.PORT || PORT, function() {
  console.log("Bot is listening on port " + PORT);
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  console.log("Request was made at", req.url);
  res.status(200);
});
/*
  This is a combo bot & slash command App
    ✓ Be able to perform slash commands anywhere that just update your status
    - Be able to message to bot to update your status and get user's status

  It should send a message on slack at 9:30am M-F to ask users their status
    - Have button options to select status

  You should be able to do slash commands at any time to update your status
    ✓ e.g. /home /office /vacation /status etc

  You should be able to ask the bot what the status of a certain user is
    - e.g. Where is @philipwisner

  You should be able to ask who all in a channel is at what status
    - e.g. Who is #office today


  LATER
    - Schedule your vacation or working from home time
    - Integrate with outlook to show when a user in on a meeting
    - Web interface to have a visual snapshot of office
    - Collect data and run analytics on worker status


*/

app.post("/", (req, res) => {
  let command = req.body.command;
  let status, emoji, help;
  let userName = req.body.user_name;
  let userId = req.body.user_id;
  let channelId = req.body.channel_id;
  //let expiration = +Date.now();
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

      /*
      const schedule = await web.chat.scheduleMessage({
        channel: "bot_test",
        text: "Don't forget to update your status.",
        post_at: 1566488565
      });
      */
    }

    res.json()

    /*
    const success = await web.chat.postMessage({
      text: `Your status is now *${status}* ${emoji}`,
      reply_broadcast: false,
      as_user: false,
      username: "Status Bot",
      channel: channelId
    });
    */

    //console.log(`Successfully updated status`, JSON.stringify(result));
    //console.log(`Successfully sent message`, JSON.stringify(success));
  })();


  /*
  request.post("https://slack.com/api/users.profile.set", data,
  function(error,response,body) {
    console.log(body)
    res.json();
  });
  */

  /* THIS POSTS A MESSAGE!
  request.post("https://slack.com/api/chat.postMessage", data,
  function(error,response,body) {
    console.log(body)
    res.json();
  });
  */

});


