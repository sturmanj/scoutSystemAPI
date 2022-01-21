require('dotenv').config()
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

async function getVals() {
    let userlist = await client.users.list()
    let users = userlist.members
    
    console.log(users[2].profile.image_512)
}

getVals()