export default {
  config: {
    name: "اضف",
    aliases: ["اضف"],
    version: "2.0",
    permission: 1,
    credits: "XaviaTeam",
    description: "إضافة أعضاء إلى المجموعة بالرابط أو UID",
    usages: "[رابط أو UID أو عدة روابط]",
    category: "group",
    cooldown: 5
  },

  onCall: async function ({ message, args, api }) {
    const { threadID } = message;

    if (args.length === 0)
      return message.reply("يرجى إدخال رابط/روابط أو UID/UIDs.");

    const success = [];
    const failed = [];

    for (const item of args) {
      let uid = null;

      if (/facebook\.com/.test(item)) {
        // رابط فيسبوك
        try {
          const res = await global.api.getUID(item);
          uid = res?.uid;
        } catch (err) {
          failed.push(`${item} ❌ (رابط غير صالح)`);
          continue;
        }
      } else if (/^\d{5,30}$/.test(item)) {
        // UID مباشر
        uid = item;
      } else {
        failed.push(`${item} ❌ (غير معرف كـ UID أو رابط)`);
        continue;
      }

      try {
        await api.addUserToGroup(uid, threadID);
        success.push(uid);
      } catch (err) {
        failed.push(`${uid} ❌ (فشل الإضافة، تأكد أنه صديق)`);
      }
    }

    let msg = "";
    if (success.length > 0)
      msg += `✅ تم إضافة ${success.length} عضو:\n• ${success.join("\n• ")}\n\n`;
    if (failed.length > 0)
      msg += `❌ فشل في إضافة ${failed.length}:\n• ${failed.join("\n• ")}`;

    message.reply(msg.trim());
  }
};
