const config = {
    name: "بانكاي",
    description: "kick user",
    usage: "[reply/@mention]",
    cooldown: 5,
    permissions: [1],
    credits: "XaviaTeam",
};

const langData = {
    en_US: {
        missingTarget: "Please tag or reply message of user to kick",
        botNotAdmin: "Bot need to be admin to kick user",
        botTarget: "Why do you want to kick bot out of group :<?",
        senderTarget: "Why do you want to kick yourself out of group :v?",
        botAndSenderTarget:
            "Why do you want to kick bot and yourself out of group :v?",
        kickResult: "Kicked {success} user(s)",
        kickFail: "Failed to kick {fail} user(s)",
        error: "An error occurred, please try again later",
    },
    ar_SY: {
        missingTarget: "يرجى وضع علامة أو الرد على رسالة المستخدم للطرد",
        botNotAdmin: "يجب أن يكون البوت مسؤولًا لطرد المستخدمين",
        botTarget: "لماذا تريد طرد البوت من المجموعة؟",
        senderTarget: "هل تحاول طرد نفسك؟",
        botAndSenderTarget: "هل تحاول طرد البوت ونفسك معًا؟",
        kickResult: "𝘽𝙖𝙣𝙠𝙖𝙞 𝙆𝙖𝙩𝙚𝙣 𝙆𝙮ō𝙠𝙤𝙩𝙨𝙪 𝙆𝙖𝙧𝙖𝙢𝙖𝙩𝙨𝙪 𝙎𝙝𝙞𝙣𝙟ū\nتم طرد {success} مستخدم",
        kickFail: "فشل طرد {fail} مستخدم",
        error: "حدث خطأ، حاول مرة أخرى لاحقًا",
    }
};

function kick(userID, threadID) {
    return new Promise((resolve, reject) => {
        global.api.removeUserFromGroup(userID, threadID, (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

async function onCall({ message, getLang, data }) {
    if (!message.isGroup) return;

    const { threadID, mentions, senderID, messageReply, type, reply } = message;

    try {
        if (Object.keys(mentions).length === 0 && type !== "message_reply")
            return reply(getLang("missingTarget"));

        const threadInfo = data.thread.info;
        const { adminIDs } = threadInfo;

        const targetIDs =
            Object.keys(mentions).length > 0
                ? Object.keys(mentions)
                : [messageReply.senderID];

        if (!adminIDs.some(e => e == global.botID))
            return reply(getLang("botNotAdmin"));

        if (targetIDs.length === 1 && targetIDs[0] == global.botID)
            return reply(getLang("botTarget"));

        if (targetIDs.length === 1 && targetIDs[0] == senderID)
            return reply(getLang("senderTarget"));

        if (
            targetIDs.length === 2 &&
            targetIDs.includes(global.botID) &&
            targetIDs.includes(senderID)
        )
            return reply(getLang("botAndSenderTarget"));

        let success = 0, fail = 0;

        for (const targetID of targetIDs) {
            if (targetID === global.botID || targetID === senderID) continue;

            try {
                await kick(targetID, threadID);
                await global.sleep(500);
                success++;
            } catch (e) {
                console.error(e);
                fail++;
            }
        }

        await message.send({
            body: getLang("kickResult", { success }),
            attachment: await global.getStreamFromURL("https://i.postimg.cc/Z5m0bk6b/652591f629c1825f29dc266d9a23cfd5.jpg")
        });

        if (fail > 0)
            await reply(getLang("kickFail", { fail }));

    } catch (e) {
        console.error(e);
        reply(getLang("error"));
    }
}

export default {
    config,
    langData,
    onCall,
};
