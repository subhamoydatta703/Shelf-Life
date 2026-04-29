const Notification = require("../models/notification");

exports.getNotification = async (req, res) => {
  try {
    const notifications = await Notification.find({
      userId: req.user._id,
      notified: true
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      notifications,
    });
  } catch (error) {
    console.error("Notification fetching error: ", error);
    res.status(500).json({
      message: "Error fetching notifications",
    });
  }
};
