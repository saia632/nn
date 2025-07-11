const langData = {
    en_US: {
        warn: "[ WARN ] Please don't spam!",
        limit: "You have been kicked out of the group due to spamming!",
    },
    vi_VN: {
        warn: "[ CẢNH CÁO ] Vui lòng không spam!",
        limit: "Bạn đã bị kick khỏi nhóm vì spam!",
    },
    ar_SY: {
        warn: "[ انـذار] من فضلك توقف عن الازعاج والرسائل الطويلة!",
        limit: "سيتم طردك من المجموعة لارسال رسائل مزعجة وتخطيك الحدود!",
    },
};

const _1Sec = 1000;
const _10Sec = _1Sec * 10;
const _1Day = _1Sec * 60 * 60 * 24;
const _1Week = _1Day * 7;
const _FAST_REDUCE_INTERVAL = _10Sec;
const _MIN_TIME_BETWEEN = _1Sec * 30; // ← 30 ثانية بين الرسائل

const onLoad = () => {
    if (!global.hasOwnProperty("messageCount")) global.messageCount = [];

    setInterval(() => {
        global.messageCount.forEach((e) => {
            e.members.forEach((e) => {
                if (e.fast > 0) e.fast--;
                else if (e.fast < 0) e.fast = 0;
            });
        });
    }, _FAST_REDUCE_INTERVAL);
};

const isSpam = (memberData, preTime) => {
    let timeBetween = Date.now() - preTime;
    return timeBetween <= _MIN_TIME_BETWEEN ? 1 : 0;
};

const onCall = ({ message, getLang, data }) => {
    if (!data?.thread?.data?.antiSettings?.antiSpam) return;
    if (!message.isGroup) return;

    const { senderID, threadID } = message;

    const adminIDs = data?.thread?.info?.adminIDs?.map(a => a?.toString()) || [];
    const isAdmin = adminIDs.includes(senderID.toString());
    const isOwner = global.ownerIDs?.includes?.(senderID.toString());

    if (isAdmin || isOwner) return; // تجاهل المطور والأدمن

    if (!adminIDs.includes(global.botID)) return;

    if (!data.thread.data.hasOwnProperty("spamWarn"))
        data.thread.data.spamWarn = [];
    if (!data.thread.data.spamWarn.some((e) => e.id == message.senderID))
        data.thread.data.spamWarn.push({ id: senderID, count: [] });

    const spamWarnIndex = data.thread.data.spamWarn.findIndex((e) => e.id == senderID);
    const spamWarn = data.thread.data.spamWarn[spamWarnIndex];
    if (!spamWarn) return;

    spamWarn.count = spamWarn.count.filter((e) => e >= Date.now() - _1Week);

    if (senderID == global.botID) return;

    if (!global.messageCount.some((e) => e.threadID == threadID))
        global.messageCount.push({ threadID, members: [] });
    if (!global.messageCount.find((e) => e.threadID == threadID).members.some((e) => e.id == senderID))
        global.messageCount.find((e) => e.threadID == threadID).members.push({
            id: senderID,
            count: 0,
            countA: [],
            lastTime: 0,
            fast: 0,
        });

    const threadData = global.messageCount.find((e) => e.threadID == threadID);
    const memberData = threadData.members.find((e) => e.id == senderID);

    const preTime = memberData.lastTime;
    memberData.lastTime = Date.now();

    if (message.attachments.length > 0)
        memberData.countA.push(message.attachments.length);
    else memberData.count++;

    // تعديل الشرط للصرامة
    if (memberData.count < 1 && memberData.countA.length < 1) return;

    const isMemberSpam = isSpam(memberData, preTime);
    if (memberData.count >= 1) memberData.count = 0;
    if (memberData.countA.length >= 1)
        memberData.countA = [memberData.countA[memberData.countA.length - 1]];

    memberData.fast += isMemberSpam;

    if (memberData.fast >= 1) {
        threadData.members = threadData.members.filter((e) => e.id != senderID);
        spamWarn.count.push(Date.now());
        message.reply(getLang("warn"));

        if (spamWarn.count.length >= 2) {
            message.reply(getLang("limit"));
            global.api.removeUserFromGroup(senderID, threadID, (err) =>
                console.error(err)
            );
        }
    }
};

export default {
    onLoad,
    langData,
    onCall,
};
