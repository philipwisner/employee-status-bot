//DEPENDENCIES
const express = require("express");
const bodyParser = require("body-parser");
const donenv = require("dotenv").config();

//IMPORTS
const routes = require("./routes");

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
app.use("/", routes);


