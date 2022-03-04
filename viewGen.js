function matchView(matchNum, currentMatchList, userId) {
  let newBlock;

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
    ];
  } else if (currentMatchList.length === 8) {
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
          action_id: "fullMatch",
        },
      },
      {
        type: "divider",
      },
    ];
  } else {
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
          action_id: "joinMatch",
        },
      },
      {
        type: "divider",
      },
    ];
  }

  return newBlock;
}

function modalView() {
  let modal = {
    type: "modal",
    callback_id: "note-modal",
    title: {
      type: "plain_text",
      text: "Note Form",
      emoji: true,
    },
    submit: {
      type: "plain_text",
      text: "Submit",
      emoji: true,
    },
    type: "modal",
    close: {
      type: "plain_text",
      text: "Cancel",
      emoji: true,
    },
    blocks: [
      {
        type: "section",
        block_id: "teamNum",
        text: {
          type: "mrkdwn",
          text: "*Team Number:*",
        },
        accessory: {
          type: "static_select",
          placeholder: {
            type: "plain_text",
            text: "Select a team",
            emoji: true,
          },
          options: [
            {
              text: {
                type: "plain_text",
                text: "1540",
                emoji: true,
              },
              value: "value-0",
            },
            {
              text: {
                type: "plain_text",
                text: "2019",
                emoji: true,
              },
              value: "value-1",
            },
            {
              text: {
                type: "plain_text",
                text: "1550",
                emoji: true,
              },
              value: "value-2",
            },
          ],
          action_id: "static_select-action",
        },
      },
      {
        type: "input",
        block_id: "notes",
        element: {
          type: "plain_text_input",
          action_id: "plain_text_input-action",
        },
        label: {
          type: "plain_text",
          text: "Notes:",
          emoji: true,
        },
      },
    ],
  };

  return modal;
}

module.exports = { matchView, modalView }