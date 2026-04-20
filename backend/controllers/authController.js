const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require('joi');
const user = require("../models/user");

const registerSchema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.any().valid(Joi.ref('password')).required().messages({
        'any.only': 'Passwords do not match'
    })
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});
// register
const register = async (req, res) => {

    try {
        const { error } = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                success: false,
                message: "Check your inputs",
            });
        }
        const {name, email, password} = req.body;

        const user = await User.findOne({
            email: email
        })
        if(user){
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

         const hashedPass = await bcrypt.hash(password, 10);
         const newUser = await User.create({
            name: name,
            email: email,
            password: hashedPass,
         })
          let jwtToken = await jwt.sign(
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
      user: newUser,
    });


    } catch (error) {
        console.log("Error: ",error);
        return res.status(500).json({
            success: false,
            message: "Internal server error",
        });
        
    }
    // login

}