const Household = require("../models/household");
const User = require("../models/user");

const inviteCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};
exports.createHousehold = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const thisHousehold = await Household.create({
      name: name,
      inviteCode: inviteCode(),
      members: [req.user._id],
    });

    if (!thisHousehold) {
      return res.status(500).json({ message: "Household not created" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      householdId: thisHousehold._id,
    });

    return res.status(200).json({ message: "Household created" , household: thisHousehold});
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
