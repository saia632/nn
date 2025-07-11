// 📁 Plugins/commands/التذكير.js

export default {
  config: {
    name: "التذكير",
    aliases: ["daily", "تذكير", "reminder"],
    version: "1.0",
    description: "تشغيل أو إيقاف رسائل التذكير اليومية في المجموعة",
    usage: "[تشغيل | إيقاف]",
    cooldown: 3,
    permissions: [1], // فقط الأدمن
    category: "الإعدادات"
  },

  onCall({ message, args, data }) {
    if (!message.isGroup) return message.reply("هذا الأمر يعمل فقط داخل المجموعات 📌");

    const thread = data?.thread;
    if (!thread?.data) thread.data = {};

    const input = args[0]?.toLowerCase();
    const currentState = thread.data.dailyNoti === false ? "متوقف" : "مفعل";

    if (!input) {
      return message.reply(`🔁 حالة التذكير الحالي: ${currentState}\n\nاستخدم:\n- التذكير تشغيل\n- التذكير إيقاف`);
    }

    if (["تشغيل", "on"].includes(input)) {
      thread.data.dailyNoti = true;
      return message.reply("✅ تم تشغيل التذكير اليومي في هذه المجموعة");
    }

    if (["إيقاف", "off"].includes(input)) {
      thread.data.dailyNoti = false;
      return message.reply("🛑 تم إيقاف التذكير اليومي في هذه المجموعة");
    }

    return message.reply("❌ خيار غير معروف، استخدم: تشغيل أو إيقاف");
  }
};
