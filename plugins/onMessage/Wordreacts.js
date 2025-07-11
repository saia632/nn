const sensitiveWords = [
  "قعدت فيهو", "شوفتو", "كبير شديد", "سويهو", "اركبو",
  "تعال الزقاق", "حشرو لي", "ركبوني", "عملو لي", "كان حار",
  "وجعني", "صورتو", "وريني ليهو", "داير اشوفو"
];

const imageURL = "https://i.postimg.cc/fRp4RY6x/received-756910803453813.jpg";

export default async function ({ message, data }) {
  const { body, isGroup, threadID } = message;
  if (!isGroup || !body) return;

  const enabled = data?.thread?.data?.fiftyMode;
  if (!enabled) return;

  const lowered = body.toLowerCase();
  const matched = sensitiveWords.some(word => lowered.includes(word));

  if (matched) {
    try {
      await message.send({
        body: "قلت لي شنو ( 𖠂ᴗ𖠂)",
        attachment: await global.getStreamFromURL(imageURL)
      });
    } catch (err) {
      console.error("فشل إرسال الصورة:", err);
    }
  }
}
