require('dotenv').config()

const express = require('express')
const api = express()

api.use(express.json())

const slackRouter = require("./routes/slack")
api.use('/slack', slackRouter)

api.listen(process.env.APIPORT, () => console.log('Server Started'))

//SHEETS
const { google } = require("googleapis")

api.get("/", async (req, res) => {
    const auth = new google.auth.GoogleAuth({
        keyFile: "slackAPIkeys.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets",
    })
    const client = await auth.getClient()
    const googleSheets = google.sheets({ version: "v4", auth: client })
    const spreadsheetId = "1AH1xf7_ScLn-0HVFvmpZcKElpfh6UOsB-KyPD1IFsUg"

    /*
    await googleSheets.spreadsheets.values.append({
        auth,
        spreadsheetId,
        range: "Sheet1!C:C",
        valueInputOption: "USER_ENTERED",
        resource: {
            values: [["HALLO WORLD"]],
        },
    });

    await googleSheets.spreadsheets.values.update({
        auth,
        spreadsheetId,
        range: 'D6',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: [["hello world!!!"]]
        },
    })
    */
    
    const data = await googleSheets.spreadsheets.values.batchGet({
        auth,
        spreadsheetId,
        majorDimension: 'COLUMNS',
        ranges: "Sheet1!A1:E8"
      });

    res.send(data)
})
/*
const { google } = require("googleapis")
const auth = new google.auth.GoogleAuth({
    keyFile: "slackAPIkeys.json",
    scopes: "https://www.googleapis.com/auth/spreadsheets",
})
const client = await auth.getClient()
export default client;

const { App } = require('@slack/bolt');
const slackApp = new App({
  token: process.env.SLACK_BOT_TOKEN,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN
});
module.exports = { slackApp }
*/