export default {
  config: {
    name: "المطور",
    aliases: ["dev", "developer"],
    version: "1.1",
    permission: 0,
    credits: "XaviaTeam",
    description: "عرض معلومات عن المطور والبوت",
    category: "معلومات",
    usages: "",
    cooldown: 3
  },

  onCall: async function ({ message, threads }) {
    const developerID = "61562119538523";
    const developerName = "ᏉᎬᏒᎶᎥᏞ ᏕᏢᎯᏒᎠᎯ";
    const botName = global.config.BOTNAME || "XaviaBot";
    const version = global.config.VERSION || "1.0.0";
    const prefix = global.config.PREFIX || "/";
    
    // حساب مدة التشغيل
    const uptimeSec = process.uptime();
    const uptimeHrs = Math.floor(uptimeSec / 3600);
    const uptimeMin = Math.floor((uptimeSec % 3600) / 60);
    const uptimeStr = `${uptimeHrs} ساعة و ${uptimeMin} دقيقة`;

    // عدد المجموعات
    const allThreads = await threads.getAll() || [];
    const groupCount = allThreads.filter(t => t.isGroup).length;

    const info = `
╭── ⌈ ⚔️🪙 ∭ 𝒅𝒆𝒎𝒐𝒏 𝒌𝒊𝒏𝒈 ∭🪙⚔️ 𝑴𝒐𝒛𝒂𝒂𝒏 ⌋
│ ⚙️ الاسم: ${botName}
│ 🧩 الإصدار: ${version}
│ 💬 البادئة: ${prefix}
│ 🕓 مدة التشغيل: ${uptimeStr}
│ 👥 المجموعات: ${groupCount} مجموعة
├── ⌈ المطور ⌋
│ 👑 الاسم: ${developerName}
│ 🔗 الحساب:
│ https://facebook.com/profile.php?id=${developerID}
│ 💌 للتواصل أو الدعم الفني لا تتردد 💙
╰── ✦ صلِّ على النبي ﷺ
    `.trim();

    await message.send(info);
  }
};
