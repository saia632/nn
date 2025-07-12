export const config = {
  name: "المطور",
  version: "1.0.0",
  aliases: ["مطور", "dev"],
  description: "عرض معلومات البوت والمطور",
  usage: "",
  credits: "XaviaTeam",
  cooldown: 3,
  permissions: [0],
  category: "معلومات"
};

import moment from "moment-timezone";

export async function onCall({ message }) {
  const developerID = "61562119538523";
  const developerName = "ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ";
  const botName = "⚔️🪙 ∭ 𝒅𝒆𝒎𝒐𝒏 𝒌𝒊𝒏𝒈 ∭🪙⚔️𝑴𝒐𝒛𝒂𝒂𝒏";
  const version = global.config.VERSION || "1.0.0";
  const prefix = global.config.PREFIX || "/";

  const threads = global.data.threads || new Map();
  const groupCount = threads.size;
  const uptimeMs = process.uptime() * 1000;
  const uptimeStr = moment.utc(uptimeMs).format("HH:mm:ss");

  const info = `
╭───⌈ ⚙️ مـعـلـومـات الـبـوت ⌋
│ 🤖 الاسم: ${botName}
│ 🧩 الإصدار: ${version}
│ 📝 البادئة: ${prefix}
│ 🏘️ عدد المجموعات: ${groupCount}
│ ⏱️ مدة التشغيل: ${uptimeStr}
╰──────────────

╭───⌈ 👑 مـعـلـومـات الـمـطـور ⌋
│ 🧠 الاسم: ${developerName}
│ 🔗 الحساب:
│ https://facebook.com/profile.php?id=${developerID}
╰──────────────

💙 لأي استفسار أو دعم فني، لا تتردد في مراسلتي.
`.trim();

  message.reply(info);
}
