const Item = require("../models/item");
const Joi = require("joi");

const updateSchema = Joi.object({
  name: Joi.string(),
  category: Joi.string().valid(
    "produce",
    "dairy",
    "meat",
    "pantry",
    "frozen",
    "other",
  ),
  quantity: Joi.number().min(1),
  expiryDate: Joi.date(),
  status: Joi.string().valid(
    "fresh",
    "expiring-soon",
    "expired",
    "used",
    "wasted",
  ),
}).min(1);
exports.createItem = async (req, res) => {
  try {
    const { name, category, expiryDate, quantity } = req.body;
    if (!name || !expiryDate || !quantity) {
      return res.status(400).json({
        message: "Name, expiryDate and quantity are required",
      });
    }
    const thisItem = await Item.create({
      name: name,
      addedBy: req.user._id,
      category: category,
      householdId: req.user.householdId,
      expiryDate: expiryDate,
      quantity: quantity,
    });
    return res.status(201).json({
      message: "Item created successfully",
      item: thisItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.getItems = async (req, res) => {
  try {
    const existItem = await Item.find({ householdId: req.user.householdId });

    return res.status(200).json({
      success: true,
      items: existItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
exports.updateItem = async (req, res) => {
  try {
    const { error, value } = updateSchema.validate(req.body, {
      stripUnknown: true,
      abortEarly: false,
    });
    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }
    const itemId = req.params.id;

    const updatedItem = await Item.findOneAndUpdate(
      { _id: itemId, householdId: req.user.householdId },
      value,
      { new: true, runValidators: true },
    );

    if (!updatedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found",
      });
    }
    return res.status(200).json({
      success: true,
      item: updatedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};

exports.deleteItem = async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Item.findOneAndDelete({
      _id: itemId,
      householdId: req.user.householdId,
    });
    if (!deletedItem) {
      return res.status(404).json({
        success: false,
        message: "Item not found or unauthorized",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Item deleted",
      item: deletedItem,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Internal server error",
    });
  }
};
