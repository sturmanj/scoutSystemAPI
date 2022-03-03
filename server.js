require('dotenv').config()

const express = require('express')
const api = express()

api.use(express.json())

const slackRouter = require("./routes/slack")
api.use('/slack', slackRouter)

api.listen(process.env.APIPORT, () => console.log('Server Started'))