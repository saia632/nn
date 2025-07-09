const config = {
  name: "مجموعات",
  aliases: ["groups", "قروبات", "موافقة", "رفض"],
  description: "عرض كل القروبات وقائمة القروبات المعلقة للموافقة أو الحظر أو المغادرة",
  usage: "",
  cooldown: 5,
  permissions: [2],
  credits: "XaviaTeam",
  isAbsolute: true
};

const langData = {
  "ar_SY": {
    "list": "🔹 قائمة المجموعات:\n\n{list}\n\nاكتب رقم المجموعة للمغادرة أو block <الرقم> للحظر خلال 30 ثانية.",
    "invalid": "❌ الرقم غير صحيح أو غير موجود.",
    "left": "✅ غادر البوت المجموعة.\n📩 المطور: {devName}\n🔗 {devLink}",
    "blocked": "🚫 تم حظر المجموعة بنجاح.",
    "error": "⚠️ حصل خطأ.",
    "pendingThreadList": "📌 مجموعات تنتظر الموافقة:\n{pendingThread}\n\n✅ approve <رقم> أو all\n❌ deny <رقم> أو all",
    "pendingThreadListEmpty": "لا توجد مجموعات معلقة حالياً.",
    "approved": `✅ تمت الموافقة على المجموعة بنجاح.`,
    "denied": `❌ تم رفض مجموعتك من قبل الإدارة.`,
    "successApprove": "✔ تمت الموافقة على {success} مجموعة",
    "failApprove": "❌ فشل في الموافقة:\n{fail}",
    "successDeny": "✔ تم رفض {success} مجموعة",
    "failDeny": "❌ فشل في رفض:\n{fail}"
  }
};

const blockedGroups = global.blockedGroups || (global.blockedGroups = []);

async function onCall({ message, args, getLang, event }) {
  const subCommand = args[0]?.toLowerCase();

  // موافقة أو رفض المعلّقة
  if (subCommand === "approve" || subCommand === "deny" || subCommand === "رفض" || subCommand === "موافقة") {
    const isApprove = subCommand.includes("approve") || subCommand === "موافقة";

    const SPAM = await global.api.getThreadList(100, null, ["OTHER"]);
    const PENDING = await global.api.getThreadList(100, null, ["PENDING"]);
    const pendingThread = [...SPAM, ...PENDING].filter(thread => thread.isGroup && thread.isSubscribed);

    if (pendingThread.length === 0) return message.reply(getLang("pendingThreadListEmpty"));

    const input = args[1];
    const indexes = input === "all"
      ? pendingThread.map((_, i) => i)
      : [parseInt(input) - 1].filter(i => i >= 0 && i < pendingThread.length);

    if (indexes.length === 0) return message.reply(getLang("invalid"));

    let success = 0, fail = [];

    for (const i of indexes) {
      const thread = pendingThread[i];
      const { threadID: cTID } = thread;

      try {
        if (isApprove) {
          await message.send(getLang("approved"), cTID);
        } else {
          await message.send(getLang("denied"), cTID);
        }
        await global.api.removeUserFromGroup(global.botID, cTID);
        success++;
      } catch {
        fail.push(cTID);
      }

      await global.sleep(500);
    }

    if (isApprove)
      message.reply(getLang("successApprove", { success }) + (fail.length ? "\n" + getLang("failApprove", { fail: fail.join("\n") }) : ""));
    else
      message.reply(getLang("successDeny", { success }) + (fail.length ? "\n" + getLang("failDeny", { fail: fail.join("\n") }) : ""));
    return;
  }

  // عرض القروبات الموجودة حاليًا
  try {
    const threads = await global.api.getThreadList(100, null, ["INBOX"]);
    const groups = threads.filter(g => g.isGroup);

    if (groups.length === 0) return message.reply("❌ لا يوجد مجموعات حاليًا.");

    const list = groups.map((g, i) => `${i + 1}. ${g.name} (${g.threadID})`).join("\n");
    message.reply(getLang("list", { list })).then(res => {
      global.client.handleReply.push({
        name: config.name,
        messageID: res.messageID,
        author: event.senderID,
        type: "choose-group",
        groups
      });
    });
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

async function handleReply({ event, Reply, message, getLang }) {
  const input = event.body.trim();
  const isBlock = input.toLowerCase().startsWith("block");
  const indexStr = isBlock ? input.split(" ")[1] : input;
  const index = parseInt(indexStr);

  if (isNaN(index) || index < 1 || index > Reply.groups.length)
    return message.reply(getLang("invalid"));

  const group = Reply.groups[index - 1];
  const devName = global.config.BOTNAME || "المطور";
  const devLink = global.config.CONTACT || "https://facebook.com/mozan50sama";

  try {
    await global.api.removeUserFromGroup(global.botID, group.threadID);
    if (isBlock) {
      if (!blockedGroups.includes(group.threadID)) blockedGroups.push(group.threadID);
      await message.send(getLang("blocked"), group.threadID);
      return message.reply(`🚫 تم حظر ومغادرة المجموعة: ${group.name}`);
    } else {
      await message.send(getLang("left", { devName, devLink }), group.threadID);
      return message.reply(`✅ غادر البوت المجموعة: ${group.name}`);
    }
  } catch (err) {
    console.error(err);
    message.reply(getLang("error"));
  }
}

export default {
  config,
  langData,
  onCall,
  handleReply
};
