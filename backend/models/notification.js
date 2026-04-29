const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema({
     userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      message:{
        type: String,
        required: true
      },
      isRead:{
        type: Boolean,
        default: false
      },
      notified: {
  type: Boolean,
  default: false,
}
}, {timestamps: true})

module.exports = mongoose.model("Notification", notificationSchema);