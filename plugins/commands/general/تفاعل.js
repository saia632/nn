const config = {
  name: "تفاعل",
  aliases: ["top", "المتصدرين", "الأنشط"],
  description: "عرض الأعضاء الأكثر تفاعلاً في المجموعة",
  usage: "",
  cooldown: 5,
  permissions: [0],
  credits: "XaviaTeam",
  category: "معلومات"
};

function expToLevel(exp) {
  let level = 0;
  while (exp >= 5 * level * level + 50 * level + 100) level++;
  return level;
}

async function onCall({ message }) {
  const { threadID } = message;
  const threadData = global.data.threads.get(threadID);
  if (!threadData || !threadData.info || !Array.isArray(threadData.info.members)) {
    return message.reply("❌ لا توجد بيانات كافية في هذه المجموعة.");
  }

  const members = threadData.info.members.filter(m => typeof m.exp === "number");

  if (members.length === 0) {
    return message.reply("🚫 لا يوجد أعضاء لديهم نقاط تفاعل بعد.");
  }

  const top = members
    .sort((a, b) => b.exp - a.exp)
    .slice(0, 5)
    .map((member, index) => {
      const name = global.data.users.get(member.userID)?.info?.name || "مجهول";
      const exp = member.exp;
      const level = expToLevel(exp);
      const medals = ["🥇", "🥈", "🥉", "🏅", "🎖️"];
      return `${medals[index] || `#${index + 1}`} ${name}\n📊 نقاط: ${exp} | 📈 مستوى: ${level}`;
    });

  const response = `🏆 | أعـضـاء المجموعة الأكـثـر تـفـاعـلاً:\n\n${top.join("\n\n")}`;
  message.reply(response);
}

export default {
  config,
  onCall
};
