const TRANSACTION_HEWEDB = require("../model/transactionDbModel");
const MAIL_HISTORY = require("../model/mailHistoryModel");
const USER = require("../model/userModel");
const { sendMailWarningHeweDB } = require("../common/verifyEmail");
const { writeLogSendMail } = require("../module/log");
const dayjs = require("dayjs");
const cron = require("node-cron");
const { callFunctionExtend } = require("./user/newUserController");

const cronJobSendMailHeweDB = async () => {
  try {
    // cronjob này chạy mỗi tiếng 1 lần vào phút thứ 30 (VD: 01:30, 02:30, 03:30, ...)
    // tìm các giao dịch hewedb đang inprocess và sẽ hết hạn trong 1 tiếng tiếp theo
    const now = new Date();
    console.log("now", now);
    // const dayOffset = 3;
    // const targetDay = new Date(now.getTime() + dayOffset * 24 * 60 * 60 * 1000);
    const targetDay = new Date(now.getTime() + 1 * 60 * 60 * 1000); // 1 hour later
    console.log("targetDay", targetDay);

    // const startOfDay = new Date(targetDay.setHours(0, 0, 0, 0));
    // const endOfDay = new Date(targetDay.setHours(23, 59, 59, 999));

    const result = await TRANSACTION_HEWEDB.find({
      status: "inprocess",
      endTime: {
        $gte: now,
        $lte: targetDay,
      },
    });

    for (const transaction of result) {
      // chạy tuần tự từng giao dịch để tránh dính mail spam
      // mỗi giao dịch hewedb của user sẽ gửi mail 1 lần
      const mailHistory = await MAIL_HISTORY.findOne({
        userId: transaction.userId,
        transactionId: transaction._id,
      });

      if (mailHistory) {
        console.log("Mail already sent for transaction:", transaction._id);
        continue;
      }

      const endTime = transaction.endTime;
      const threeDaysLater = new Date(endTime.getTime() + 3 * 24 * 60 * 60 * 1000);
      const x = dayjs(endTime).add(7, "hours").format("HH:mm DD/MM/YYYY");
      const y = dayjs(threeDaysLater).add(7, "hours").format("HH:mm DD/MM/YYYY");

      console.log(`Từ ${x} đến ${y} (Giờ Việt Nam GMT+7)`);

      const result = await sendMailWarningHeweDB(
        transaction.userEmail,
        transaction.userName,
        `Từ ${x} đến ${y} (Giờ Việt Nam GMT+7)`
      );

      if (result.isSuccess) {
        // lưu lịch sử gửi mail
        await MAIL_HISTORY.create({
          userId: transaction.userId,
          transactionId: transaction._id,
          fromMail: result.data.from,
          toMail: result.data.to,
          content: result.data.html,
        });

        console.log("Mail sent successfully to:", transaction.userEmail);
      } else {
        console.error("Error sending mail to:", transaction.userEmail, result.error);
        await writeLogSendMail(`Error sending mail to ${transaction.userEmail}: ${result.error}`);
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const cronJobAutoRenewHeweDB = async () => {
  try {
    // cronjob này chạy mỗi tiếng 1 lần vào phút thứ 45 (VD: 01:45, 02:45, 03:45, ...)
    // tìm các giao dịch hewedb đang inprocess và đã hết hạn đủ 3 ngày
    // logic: khi hết hạn, user sẽ có thời gian 3 ngày để hành động (gia hạn, huỷ gia hạn)
    // sau 3 ngày mà không hành động gì (tức là vẫn inprocess) thì sẽ tự động gia hạn 1 năm

    const now = new Date();
    const dayOffset = 3;
    const targetDay = new Date(now.getTime() - dayOffset * 24 * 60 * 60 * 1000);

    const result = await TRANSACTION_HEWEDB.find({
      status: "inprocess",
      endTime: { $lte: targetDay },
    });

    for (const transaction of result) {
      // chạy tuần tự từng giao dịch
      // gọi hàm để tự động gia hạn (tương tự như khi user chủ động gia hạn)

      const userId = transaction.userId;
      const userData = await USER.findOne({ _id: userId });
      await callFunctionExtend(userId, userData, transaction.transactionId, transaction, 1, "auto-renew");
    }

    return result.length;
  } catch (error) {
    console.log(error);
  }
};

cron.schedule("30 * * * *", async function () {
  try {
    cronJobSendMailHeweDB();
  } catch (error) {
    console.log("Error in cron job:", error);
  } finally {
    console.log("Cron job executed at:", new Date().toISOString());
  }
});

cron.schedule("20 * * * *", async function () {
  try {
    const res = await cronJobAutoRenewHeweDB();
    console.log("🟢 cronJobAutoRenewHeweDB executed at:", new Date().toISOString(), `${res} transactions done!`);
  } catch (error) {
    console.log("Error in cronJobAutoRenewHeweDB:", error);
  }
});