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
    - Be able to perform slash commands anywhere that just update your status
    - Be able to message to bot to update your status and get user's status

  It should send a message on slack at 9:30am M-F to ask users their status
    - Have button options to select status

  You should be able to do slash commands at any time to update your status
    - e.g. /home /office /vacation /status etc

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
  let status, emoji;
  var userId = req.body.user_id;
  var userName = req.body.user_name;

  console.log(`${userName} has requested ${command}`);

  switch (command) {
    case "/status":
      status = "What do you want to change your status to?";
      emoji = ":question:";
      break;
    case "/home":
      status = "Working from home";
      emoji = ":house:";
      break;
    case "/office":
      status = "In the office";
      emoji = ":office:";
      break;
    case "/vacation":
      status = "On vacation";
      emoji = ":palm_tree:";
      break;
    case "/sick":
      status = "Out sick";
      emoji = ":face_with_thermometer:";
      break;
    case "/late":
      status = "Running late";
      emoji = ":runner:";
      break;
    case "/meeting":
      status = "In a meeting";
      emoji = ":spiral_calendar_pad:";
      break;
    default:
      status = "Not recognized";
      emoji = ":question:";
  }
  let data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      profile: {
        status_text: status,
        status_emoji: emoji,
        status_expiration: 0
      }
    }
  };

  /*
  (async () => {
    const result = await web.users.profile.get({
      include_labels: true,
      user: userId,
    });

    // The result contains an identifier for the message, `ts`.
    console.log(
      "Successfully sent message" + JSON.stringify(result)
    );
  })();
  */


  (async () => {
    const result = await web.users.profile.set({
      profile: {
        status_text: status,
        status_emoji: emoji,
        status_expiration: 0
      }
    });

    const success = await web.chat.postMessage({
      text: `Your status is now ${status} ${emoji}`,
      reply_broadcast: false,
      as_user: false,
      username: "Status Bot",
      channel: "bot_test"
    });


    // The result contains an identifier for the message, `ts`.
    console.log(
      `Successfully updated status`, JSON.stringify(result)
    );
    console.log(
      `Successfully sent message`, JSON.stringify(success)
    );
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


