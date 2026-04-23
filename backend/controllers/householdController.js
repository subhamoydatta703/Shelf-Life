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

    return res
      .status(200)
      .json({ message: "Household created", household: thisHousehold });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.joinHousehold = async (req, res) => {
  try {
    const { inviteCode } = req.body;
    if (!inviteCode) {
      return res.status(400).json({ message: "Invite code is required" });
    }

    const normalizedCode = inviteCode.trim().toUpperCase();
    const inviteHousehold = await Household.findOne({ inviteCode: normalizedCode });
    if (!inviteHousehold) {
      return res.status(404).json({
        message: "Invalid invite code",
      });
    }

    const userId = req.user._id;

    if (req.user.householdId) {
      await Household.updateOne(
        { _id: req.user.householdId },
        { $pull: { members: userId } },
      );
    }

    const result = await Household.updateOne(
      {
        _id: inviteHousehold._id,
        members: { $ne: req.user._id },
      },
      { $addToSet: { members: req.user._id } },
    );
    if (result.modifiedCount === 0) {
      return res.status(400).json({
        message: "Already a member",
      });
    }

    await User.findByIdAndUpdate(
      req.user._id,
      { householdId: inviteHousehold._id },
      { new: true, runValidators: true },
    );

    return res.status(200).json({
      message: "Joined successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
