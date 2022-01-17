//API
const express = require('express')
const router = express.Router();
require('dotenv').config()

module.exports = router

router.post('/:text', (req, res) => {
  sendMessage("ima-testin-me-fine-bots-here", req.params.text)  
  res.sendStatus(200)
})



//SLACKBOT
const { App } = require('@slack/bolt');

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});

slackApp.command('/ping', async ({ command, ack, respond }) => {
  await ack();

  await respond('pong');
});

(async () => {
  await slackApp.start(process.env.APPPORT);
  console.log('Slack Bot Started');
})();

//Send Message Command
async function sendMessage(channel, text) {
  slackApp.client.chat.postMessage({
    token: process.env.SLACK_BOT_TOKEN,
    channel: channel,
    text: text
  });
}