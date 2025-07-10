const config = {
  name: "ترحيب",
  description: "تشغيل/إيقاف الترحيب وتحديد كنية تلقائية عند دخول عضو",
  usage: "[on/off/set <كنية>]",
  permissions: [1],
  cooldown: 3,
  credits: "Mozan",
  isAbsolute: true,
  groupOnly: true
};

const langData = {
  "ar_SY": {
    "welcomeOn": "✅ تم تفعيل الترحيب التلقائي.",
    "welcomeOff": "❌ تم إيقاف الترحيب التلقائي.",
    "setName": "✅ تم تعيين الكنية التلقائية إلى: {name}",
    "missingName": "يرجى كتابة الكنية الجديدة بعد الأمر.",
    "status": "📌 حالة الترحيب:\n- مفعل: {status}\n- الكنية التلقائية: {name}"
  }
};

async function onCall({ message, args, getLang, data }) {
  const { threadID } = message;
  const threadData = data.thread.data || {};

  if (args.length === 0) {
    const status = threadData.enableWelcome ? "نعم" : "لا";
    const name = threadData.welcomeName || "غير محددة";
    return message.reply(getLang("status", { status, name }));
  }

  const subCmd = args[0].toLowerCase();

  if (subCmd === "on") {
    threadData.enableWelcome = true;
    await global.controllers.Threads.updateData(threadID, threadData);
    return message.reply(getLang("welcomeOn"));
  }

  if (subCmd === "off") {
    threadData.enableWelcome = false;
    await global.controllers.Threads.updateData(threadID, threadData);
    return message.reply(getLang("welcomeOff"));
  }

  if (subCmd === "set") {
    const newName = args.slice(1).join(" ");
    if (!newName) return message.reply(getLang("missingName"));

    threadData.welcomeName = newName;
    await global.controllers.Threads.updateData(threadID, threadData);
    return message.reply(getLang("setName", { name: newName }));
  }

  return message.reply(getLang("status", {
    status: threadData.enableWelcome ? "نعم" : "لا",
    name: threadData.welcomeName || "غير محددة"
  }));
}

export default {
  config,
  langData,
  onCall
};
