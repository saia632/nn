export default {
  config: {
    name: "خمسين",
    aliases: [],
    description: "تشغيل أو إيقاف الرد التلقائي على الكلمات الممنوعة",
    usage: "[تشغيل/ايقاف]",
    cooldown: 3,
    permissions: [1], // الأدمن فقط
    credits: "XaviaTeam"
  },

  langData: {
    "ar_SY": {
      enabled: "✅ تم *تشغيل* نظام الرد على الكلمات بنجاح.",
      disabled: "❌ تم *إيقاف* نظام الرد على الكلمات.",
      missingArg: "يرجى استخدام: خمسين تشغيل | خمسين ايقاف"
    }
  },

  onCall({ message, args, getLang, data, threads }) {
    const input = args[0]?.toLowerCase();

    if (!["تشغيل", "ايقاف"].includes(input))
      return message.reply(getLang("missingArg"));

    const enable = input === "تشغيل";
    data.thread.data.fiftyMode = enable;

    threads.updateData(message.threadID, { data: data.thread.data });

    return message.reply(getLang(enable ? "enabled" : "disabled"));
  }
};
