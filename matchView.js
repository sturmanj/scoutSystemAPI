function matchView(matchNum, currentMatchList, userId) {
  let newBlock

  if (currentMatchList.includes(userId)) {
    newBlock = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Match ${matchNum + 1} \nScouts: ${currentMatchList.length}/8`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Leave",
            emoji: true,
          },
          style: "danger",
          value: `${matchNum}`,
          action_id: "leaveMatch",
          confirm: {
            title: {
              type: "plain_text",
              text: "Please don't leave :(",
            },
            text: {
              type: "mrkdwn",
              text: "Are you sure you don't want to scout this match?",
            },
            deny: {
              type: "plain_text",
              text: "No, I still want to scout",
            },
            confirm: {
              type: "plain_text",
              text: "leave",
            },
          },
        },
      },
      {
        type: "divider",
      },
    ]
  }

  else if (currentMatchList.length === 8) {
    newBlock = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Match ${matchNum + 1} \nScouts: ${currentMatchList.length}/8`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Full",
            emoji: true,
          },
          value: `${matchNum}`,
          action_id: "fullMatch"
        },
      },
      {
        type: "divider",
      },
    ];
  }

  else {
    newBlock = [
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: `Match ${matchNum + 1} \nScouts: ${currentMatchList.length}/8`,
        },
        accessory: {
          type: "button",
          text: {
            type: "plain_text",
            text: "Join",
            emoji: true,
          },
          style: "primary",
          value: `${matchNum}`,
          action_id: "joinMatch"
        },
      },
      {
        type: "divider",
      },
    ]
  }

  return newBlock
}

module.exports = matchView;
