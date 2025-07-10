export default async function ({ event }) {
  const { api } = global;
  const { threadID, logMessageData } = event;
  const { Threads, Users } = global.controllers;

  if (event.logMessageType !== "log:subscribe") return;

  const threadData = await Threads.get(threadID) || {};
  const threadInfo = threadData.info || {};
  const threadSettings = threadData.data || {};
  const welcomeName = threadSettings?.welcomeName || null;

  if (!logMessageData?.addedParticipants || logMessageData.addedParticipants.length === 0) return;

  const addedUsers = logMessageData.addedParticipants;
  const totalMembers = threadInfo.members?.length || 0;

  for (const user of addedUsers) {
    const uid = user.userFbId;
    const name = user.fullName || (await Users.getName(uid)) || "عضو";

    // تغيير الكنية إذا تم تحديدها مسبقًا
    if (welcomeName) {
      try {
        await api.changeNickname(welcomeName.replace("{name}", name), threadID, uid);
      } catch (e) {
        console.error(`[ترحيب] فشل في تغيير الكنية:`, e);
      }
    }

    // إرسال رسالة ترحيب
    const welcomeMessage = `👋 أهلاً بك ${name} في المجموعة!\n🆔 أنت العضو رقم ${totalMembers + 1} 🎉`;
    api.sendMessage(welcomeMessage, threadID);
    global.sleep(300);
  }
}
