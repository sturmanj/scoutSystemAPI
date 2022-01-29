//API
const express = require('express')
const router = express.Router();
require('dotenv').config()

module.exports = router

router.post('/:text', (req, res) => {
  sendMessage("ima-testin-me-fine-bots-here", req.params.text)
  res.sendStatus(200)
})

//Sheets
const { google } = require("googleapis")

const spreadsheetId = "1AH1xf7_ScLn-0HVFvmpZcKElpfh6UOsB-KyPD1IFsUg"
const auth = new google.auth.GoogleAuth({
    keyFile: "slackAPIkeys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
})

async function insertData(cell, text) {
    const client = await auth.getClient()
    const googleSheets = google.sheets({ version: "v4", auth: client })
    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: cell,
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [[text]]
        },
    })
}


//SLACKBOT

const { App } = require('@slack/bolt');

const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN 
});

slackApp.command('/ping', async ({ ack, respond }) => {
  await ack();

  await respond('pong');
});

slackApp.command('/webnote', async ({ command, ack, }) => {
  await ack();
  sendMessage(command.user_id, "http://localhost:8080?scout=" + command.user_id + 
              "&eventId=" + process.env.EVENT)
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


slackApp.command('/note', async ({ ack, body, client }) => {
  // Acknowledge the command request
  await ack();

  await client.views.open({
    // Pass a valid trigger_id within 3 seconds of receiving it
    trigger_id: body.trigger_id,
    // View payload
    view: {
      "title": {
        "type": "plain_text",
        "text": "Note Form",
        "emoji": true
      },
      "submit": {
        "type": "plain_text",
        "text": "Submit",
        "emoji": true
      },
      "type": "modal",
      "close": {
        "type": "plain_text",
        "text": "Cancel",
        "emoji": true
      },
      "blocks": [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "*Team Number:*"
          },
          "accessory": {
            "type": "static_select",
            "placeholder": {
              "type": "plain_text",
              "text": "Select a team",
              "emoji": true
            },
            "options": [
              {
                "text": {
                  "type": "plain_text",
                  "text": "1540",
                  "emoji": true
                },
                "value": "value-0"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "2019",
                  "emoji": true
                },
                "value": "value-1"
              },
              {
                "text": {
                  "type": "plain_text",
                  "text": "1550",
                  "emoji": true
                },
                "value": "value-2"
              }
            ],
            "action_id": "static_select-action"
          }
        },
        {
          "type": "input",
          "element": {
            "type": "plain_text_input",
            "action_id": "plain_text_input-action"
          },
          "label": {
            "type": "plain_text",
            "text": "Notes:",
            "emoji": true
          }
        }
      ]
    }
  });
});



// Listen to the app_home_opened Events API event to hear when a user opens your app from the sidebar
slackApp.event("app_home_opened", async ({ payload, client }) => {
  const userId = payload.user;
  await client.views.publish({
    user_id: userId,
    view: {
      "type": "home",
      "blocks": [
        {
          "type": "header",
          "text": {
            "type": "plain_text",
            "text": "Wilsonville Scouting",
            "emoji": true
          }
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Match 1 \nScouts: 3/8"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Join",
              "emoji": true
            },
            "style": "primary",
            "value": "click_me_123",
            "action_id": "match1"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Match 2 \nScouts: 8/8"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Full",
              "emoji": true
            },
            "value": "click_me_123",
            "action_id": "match2"
          }
        },
        {
          "type": "divider"
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": "Match 3 \nScouts: 6/8"
          },
          "accessory": {
            "type": "button",
            "text": {
              "type": "plain_text",
              "text": "Leave",
              "emoji": true
            },
            "style": "danger",
            "value": "click_me_123",
            "action_id": "match3"
          }
        }
      ]
    }
  });
});

slackApp.action('match1', async ({ ack }) => {
  await ack();
  insertData("B2", "name")
});

slackApp.action('match2', async ({ ack }) => {
  await ack();
  insertData("B3", "name")
});

slackApp.action('match3', async ({ ack }) => {
  await ack();
  insertData("B4", "name")
});
