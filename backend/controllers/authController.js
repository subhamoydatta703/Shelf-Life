const User = require("../models/user");
const Household = require("../models/household");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const registerSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  confirmPassword: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
  inviteCode: Joi.string().allow('', null).optional(),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});
// register
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const { name, email, password, inviteCode } = req.body;

    const thisUser = await User.findOne({
      email: email,
    });
    if (thisUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    let targetHousehold = null;
    if (inviteCode && inviteCode.trim() !== '') {
      const normalizedCode = inviteCode.trim().toUpperCase();
      targetHousehold = await Household.findOne({ inviteCode: normalizedCode });
      if (!targetHousehold) {
        return res.status(404).json({
          success: false,
          message: "Invalid invite code",
        });
      }
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name: name,
      email: email,
      password: hashedPass,
      householdId: targetHousehold ? targetHousehold._id : undefined,
    });

    if (targetHousehold) {
      await Household.updateOne(
        { _id: targetHousehold._id },
        { $addToSet: { members: newUser._id } }
      );
    }
    const userResponse = {
      _id: newUser._id,
      name: newUser.name,
      email: newUser.email,
    };
    const jwtToken = await jwt.sign(
      {
        userId: newUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );
    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token: jwtToken,
      user: userResponse,
    });
  } catch (error) {
    console.log("Error: ", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
// login

exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    const { email, password } = req.body;

    const existUser = await User.findOne({ email: email });
    if (!existUser) {
      return res.status(400).json({
        success: false,
        message: "User doesn't exists",
      });
    }

    const isMatch = await bcrypt.compare(password, existUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const userRes = {
      _id: existUser._id,
      name: existUser.name,
      email: existUser.email,
    };
    const jwtToken = await jwt.sign(
      {
        userId: existUser._id,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      token: jwtToken,
      user: userRes,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
