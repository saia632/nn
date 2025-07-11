export default async function ({ event, message, threads, users }) {
  if (event.logMessageType !== "log:subscribe") return;

  const { threadID, logMessageData } = event;
  const { addedParticipants } = logMessageData;

  const threadInfo = await threads.get(threadID);
  if (!threadInfo || !addedParticipants || addedParticipants.length === 0) return;

  const memberCount = threadInfo.members.length;

  for (const participant of addedParticipants) {
    const userID = participant.userFbId;
    const userInfo = await users.getInfo(userID);
    const name = userInfo?.name || "عضو جديد";

    const welcomeMsg = `
✧･ﾟ: *✧･ﾟ:* 𝑾𝒆𝒍𝒄𝒐𝒎𝒆 *:･ﾟ✧*:･ﾟ✧

👋 أهلاً وسهلاً بك يا ${name}
✨ لقد أصبحت العضو رقم ${memberCount} في مجموعتنا!

🪐 نتمنى لك وقتًا ممتعًا ومليئًا بالطاقة!
    `.trim();

    await message.send(welcomeMsg, threadID);
  }
}
