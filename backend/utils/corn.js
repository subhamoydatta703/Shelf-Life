const cron = require("node-cron");
const Notification = require("../models/notification");
const Items = require("../models/item");

cron.schedule("* * * * *", async () => {
  console.log("Checking expiry...");
  const today = new Date();
  const next2day = new Date();
  next2day.setDate(today.getDate() + 2);

  const items = await Items.find({ expiryDate: { $lte: next2day } });

  for (const item of items) {
    await Notification.create({
      userId: item.userId,
      message: `${item.name} is expiring soon`,
    });
  }
});
