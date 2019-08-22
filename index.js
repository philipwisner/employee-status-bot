require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");

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
  var command = req.body.command;
  console.log("reached endpoint and command is", command);
  var text;
  switch (command) {
    case "/status":
      text = "What do you want to change your status to";
      break;
    case "/home":
      text = "You have changed your status to working from home";
      break;
    case "/office":
      text = "You have changed your status to in the office";
      break;
    case "/vacation":
      text = "You have changed your status to on vacation";
      break;
    case "/sick":
      text = "You have changed your status to sick";
      break;
    case "/late":
      text = "You have changed your status to running late";
      break;
    case "/meeting":
      text = "You have changed your status to in a meeting";
      break;
    default:
      text = "Not recognized";
  }
  var data = {
    form: {
      token: process.env.SLACK_AUTH_TOKEN,
      channel: "bot_test",
      text: `Hi! :wave: \n You entered ${text}.`
    }
  };
  request.post("https://slack.com/api/chat.postMessage", data,
  function(error,response,body) {
    console.log(body)
    res.json();
  });
});
