'use strict'
const axios = require('axios').default
const cheerio = require('cheerio')

module.exports.run = async () => {
  const body = new URLSearchParams({
    cimmotool_status: 1, // Available
  })
  const response = await axios.post(
    'http://reservation.livingscience.ch/en/dynasite.cfm?cmd=cimmotool_immotool_immotool_search&dsmid=509228&skipfurl=1',
    body
  )

  const doc = cheerio.load(response.data)
  const output = doc(
    '#cimmotool_immotool_immotool_search > div.list.scroll > div'
  )
    .text()
    .trim()

  if (output === 'No record available') {
    console.log('No available room')
    return
  }

  console.log('Available rooms found')
  await axios.post(
    'https://api.line.me/v2/bot/message/push',
    {
      to: `${process.env.LINE_GROUP_ID}`,
      messages: [
        {
          type: 'text',
          text: `空き部屋が出ました $\nアクセスして確認 ↓ http://reservation.livingscience.ch/en/living`,
          emojis: [
            {
              index: 10,
              productId: '5ac22a8c031a6752fb806d66',
              emojiId: '092',
            },
          ],
        },
      ],
    },
    {
      headers: {
        Authorization: `Bearer ${process.env.LINE_CHANNEL_ACCESS_TOKEN}`,
      },
    }
  )
}
