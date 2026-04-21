const mongoose = require("mongoose");
const { Schema } = mongoose;

const itemSchema = new Schema({
  householdId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Household",
    required: true,
  },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ["produce", "dairy", "meat", "pantry", "frozen", "other"],
    default: "other",
  },
  quantity: {
    type: Number,
    required: true,
    default: 1,
  },
  expiaryDate: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["fresh", "expiring-soon", "expired", "used", "wasted"],
    default: "fresh",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
module.exports = mongoose.model("Item", itemSchema);
