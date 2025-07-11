import axios from 'axios';
import fs from 'fs-extra';
import path from 'path';
import { createCanvas, loadImage } from 'canvas';

export default {
  config: {
    name: "برو",
    aliases: ["معلوماتي"],
    version: "1.1",
    permission: 0,
    credits: "راكو سان - تعديل فيرجل ",
    description: "عرض معلوماتك الشخصية بصورة مميزة",
    category: "عام",
    usages: "",
    cooldown: 5
  },

  onCall: async function ({ message, api, event }) {
    try {
      const userID = event.senderID;
      const userInfo = await api.getUserInfo(userID);
      const userName = userInfo[userID]?.name || "مستخدم";

      const avatarURL = `https://graph.facebook.com/${userID}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;

      const imgPath = path.join(global.cachePath, `${userID}.jpg`);
      const editedImgPath = path.join(global.cachePath, `${userID}_edited.png`);

      // تحميل صورة البروفايل
      const response = await axios.get(avatarURL, { responseType: 'arraybuffer' });
      await fs.ensureDir(path.dirname(imgPath));
      await fs.writeFile(imgPath, Buffer.from(response.data, 'binary'));

      // إنشاء الصورة المعدلة
      const image = await loadImage(imgPath);
      const canvas = createCanvas(512, 600);
      const ctx = canvas.getContext('2d');

      // دائرة البروفايل
      ctx.save();
      ctx.beginPath();
      ctx.arc(256, 250, 200, 0, Math.PI * 2);
      ctx.clip();
      ctx.drawImage(image, 56, 50, 400, 400);
      ctx.restore();

      // حدود
      ctx.beginPath();
      ctx.arc(256, 250, 200, 0, Math.PI * 2);
      ctx.strokeStyle = 'gray';
      ctx.lineWidth = 2;
      ctx.stroke();

      // اسم المستخدم
      ctx.font = '40px Arial';
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // خلفية الاسم
      const textWidth = ctx.measureText(userName).width + 20;
      ctx.fillStyle = 'white';
      ctx.shadowColor = 'rgba(0,0,0,0.2)';
      ctx.shadowBlur = 5;
      ctx.shadowOffsetX = 2;
      ctx.shadowOffsetY = 2;
      ctx.fillRect(256 - textWidth / 2, 480, textWidth, 50);
      ctx.strokeStyle = 'white';
      ctx.lineWidth = 2;
      ctx.strokeRect(256 - textWidth / 2, 480, textWidth, 50);
      ctx.fillStyle = 'black';
      ctx.shadowColor = 'transparent';
      ctx.fillText(userName, 256, 505);

      // حفظ الصورة
      const buffer = canvas.toBuffer('image/png');
      await fs.writeFile(editedImgPath, buffer);

      // إرسال النتيجة
      await message.send({
        body: `⟪ معلومات حسابك الشخصية ⟫`,
        attachment: fs.createReadStream(editedImgPath)
      });

      // حذف الصور
      fs.unlinkSync(imgPath);
      fs.unlinkSync(editedImgPath);
    } catch (err) {
      console.error("خطأ في أمر برو:", err);
      return message.send("❌ حدث خطأ أثناء تنفيذ الأمر.");
    }
  }
};
