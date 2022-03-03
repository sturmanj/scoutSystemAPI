const users = require("../users.json")
const matchView = require("../matchView.js")
const { App } = require('@slack/bolt');
const fetch = require('node-fetch')
const express = require('express')
const router = express.Router();
require('dotenv').config()

//This should be imported from the database
let matchList = [["","","","","","","",""], ["","","",""], ["","","","",""], [], ["","","","","","",""], [], [], [], [], []]
const scoutManagers = ["U02HZTW2PAN"]

const idToName = new Map()
for (let i = 0; i < users.length; i++) {
  idToName.set(users[i].id, users[i].real_name);
}


//Slack bot setup
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

(async () => {
  await slackApp.start(process.env.APPPORT);
  console.log('Slack Bot Started');
})();



//API setup
router.post('/:text', (req, res) => {
  sendMessage("ima-testin-me-fine-bots-here", req.params.text)
  res.sendStatus(200)
})

module.exports = router



//Ping command to see if the server and bot are running
slackApp.command('/ping', async ({ ack, respond }) => {
  await ack();

  await respond('pong');
});

//Command to open the notes form in a browser
slackApp.command('/webnote', async ({ command, ack, }) => {
  await ack();
  sendMessage(command.user_id, "http://localhost:8080?scout=" + command.user_id +
              "&eventId=" + process.env.EVENT)
});

//Command to alert scouts for the next match
slackApp.command('/alert', async ({ command, ack, respond }) => {
  let message = ''
  let scoutTeams = []
  await ack();

  if (!scoutManagers.includes(command.user_id)) {
    await respond('You do not have permission to run this command.');
  }
  else {
    roundNumber = parseInt(command.text);
    await fetch("http://localhost:5000/roundQueue", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({roundNumber: roundNumber, eventId: 1})
    })
    .then(res => res.json())
    .then(json => {
      scoutTeams = json
    })
    .catch(err => message = err.message);
  }
  for (const element of scoutTeams) {
    message += "\n" + (element.scoutId, "http://localhost:8080/?scout=" + element.scoutId + "&eventId=1&matchNum=" + roundNumber + "&teamNum=" + element.teamNumber)
    //sendMessage(element.scoutId, "http://localhost:8080/?scout=" + element.scoutId + "&eventId=1&matchNum=" + roundNumber + "&teamNum=" + element.teamNumber)
  }
  await respond(message);
});

//Command to check who is queued
slackApp.command('/whosqueued', async ({ command, ack, respond }) => {
  let message = ''
  let scoutTeams = []
  await ack();

  if (!scoutManagers.includes(command.user_id)) {
    await respond('You do not have permission to run this command.');
  }
  else {
    roundNumber = parseInt(command.text);
    await fetch("http://localhost:5000/roundQueue", {
      "method": "POST",
      "headers": {
        "Content-Type": "application/json"
    },
    "body": JSON.stringify({roundNumber: roundNumber, eventId: 1})
    })
    .then(res => res.json())
    .then(json => {
      scoutTeams = json
    })
    .catch(err => message = err.message);

    for (const element of scoutTeams) {
      message += "\n" + (idToName.get(element.scoutId) + "  -->  " + element.teamNumber)
    }
    await respond(message);
  }
});



//Scouting sign up setup
slackApp.event("app_home_opened", async ({ payload, client }) => {
  const userId = payload.user;

  let blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Scouting Sign Up",
        "emoji": true
      }
    },
  ]

  for (let i = 0; i < matchList.length; i++) {
    blocks = blocks.concat(matchView(i, matchList[i], userId));
  }

  let view = {
    type: 'home',
    title: {
      type: 'plain_text',
      text: 'Scouting Sign Up'
    },
    blocks: JSON.stringify(blocks)
  }

  await client.views.publish({
    user_id: userId,
    view: view
  });
});



//Action listeners for the signup system
slackApp.action('joinMatch', async ({ action, body, ack }) => {
  await ack();
  userId = body.user.id
  currentMatchList = matchList[action.value]
  currentMatchList.push(userId)
  updateHome(userId)
});

slackApp.action('leaveMatch', async ({ action, body, ack }) => {
  await ack();
  userId = body.user.id
  currentMatchList = matchList[action.value]
  currentMatchList.splice(currentMatchList.indexOf("userId"), 1)
  updateHome(userId)
});

slackApp.action('fullMatch', async ({ body, ack }) => {
  await ack();
  userId = body.user.id
  updateHome(userId)
});



//Function to easily send messages
async function sendMessage(channel, text) {
  slackApp.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel,
    text: text
  });
}

//Function to easily update the home page
const updateHome = async (userId) => {
  let blocks = [
    {
      "type": "header",
      "text": {
        "type": "plain_text",
        "text": "Scouting Sign Up",
        "emoji": true
      }
    },
  ]

  for (let i = 0; i < matchList.length; i++) {
    blocks = blocks.concat(matchView(i, matchList[i], userId));
  }

  let view = {
    type: 'home',
    title: {
      type: 'plain_text',
      text: 'Scouting Sign Up'
    },
    blocks: JSON.stringify(blocks)
  }

  await slackApp.client.views.publish({
    token: process.env.SLACK_BOT_TOKEN,
    user_id: userId,
    view: view
  });
}
