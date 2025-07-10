const _24HOURs = 86400000; // 24 ساعة (عدلت القيمة لأنها كانت 26400000 بالغلط)
import axios from 'axios';

const config = {
  name: "يومية",
  aliases: ["يومية"],
  description: "استلم مكافأتك اليومية 🎁",
  credits: "XaviaTeam",
  extra: {
    min: 8000,
    max: 15000
  }
};

const langData = {
  "en_US": {
    "daily.selfNoData": "⚠️ 𝚈𝚘𝚞𝚛 𝚍𝚊𝚝𝚊 𝚒𝚜 𝚗𝚘𝚝 𝚛𝚎𝚊𝚍𝚢.",
    "daily.alreadyClaimed": "💤 𝚈𝚘𝚞 𝚊𝚕𝚛𝚎𝚊𝚍𝚢 𝚌𝚕𝚊𝚒𝚖𝚎𝚍 𝚢𝚘𝚞𝚛 𝚍𝚊𝚒𝚕𝚢 𝚛𝚎𝚠𝚊𝚛𝚍.\n⏳ 𝚃𝚛𝚢 𝚊𝚐𝚊𝚒𝚗 𝚒𝚗: {time}",
    "daily.successfullyClaimed": "🎁 𝙳𝚊𝚒𝚕𝚢 𝚛𝚎𝚠𝚊𝚛𝚍 𝚌𝚕𝚊𝚒𝚖𝚎𝚍!\n💰 𝙰𝚖𝚘𝚞𝚗𝚝: ɢᴏʟᴅ {amount} 🪙",
    "daily.failed": "❌ 𝙵𝚊𝚒𝚕𝚎𝚍 𝚝𝚘 𝚌𝚕𝚊𝚒𝚖. 𝙿𝚕𝚎𝚊𝚜𝚎 𝚝𝚛𝚢 𝚊𝚐𝚊𝚒𝚗!"
  },
  "vi_VN": {
    "daily.selfNoData": "Dữ liệu của bạn chưa sẵn sàng",
    "daily.alreadyClaimed": "Bạn đã nhận thưởng hàng ngày, bạn có thể nhận lại sau {time}",
    "daily.successfullyClaimed": "Bạn đã nhận thưởng hàng ngày {amount} vàng",
    "daily.failed": "Thất bại"
  },
  "ar_SY": {
    "daily.selfNoData": "⚠️ بياناتك غير متوفرة بعد.",
    "daily.alreadyClaimed": "📛 لقد طالبت بمكافأتك اليومية مسبقًا.\n⏳ يمكنك المطالبة مجددًا بعد: {time}",
    "daily.successfullyClaimed": "🎉 تم استلام مكافأتك اليومية بنجاح!\n💰 القيمة: {amount} ذهب 🪙",
    "daily.failed": "❌ فشل في استلام المكافأة. حاول مرة أخرى لاحقًا."
  }
};

async function onCall({ message, extra, getLang }) {
  const { Users } = global.controllers;
  const dailyImage = (await axios.get("https://i.imgur.com/L2OsbcZ.gif", {
    responseType: "stream"
  })).data;

  const { min, max } = extra;
  const userData = await Users.getData(message.senderID);
  if (!userData) return message.reply(getLang("daily.selfNoData"));

  if (!userData.hasOwnProperty("daily")) userData.daily = 0;
  const timeDiff = Date.now() - userData.daily;

  if (timeDiff < _24HOURs)
    return message.reply(getLang("daily.alreadyClaimed", {
      time: global.msToHMS(_24HOURs - timeDiff)
    }));

  const amount = global.random(min, max);
  const result = await Users.updateData(message.senderID, {
    money: BigInt(userData.money || 0) + BigInt(amount),
    daily: Date.now()
  });

  if (result) {
    message.reply({
      body: getLang("daily.successfullyClaimed", {
        amount: global.addCommas(amount)
      }),
      attachment: dailyImage
    });
  } else {
    message.reply(getLang("daily.failed"));
  }
}

export default {
  config,
  langData,
  onCall
};
