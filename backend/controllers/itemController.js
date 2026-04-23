const Item = require("../models/item");

exports.createItem = async (req, res) => {
    try {
        const {
            name,
            category,
            expiryDate,
            quantity,
        } = req.body;
        if (!name || !expiryDate || !quantity) {
            return res.status(400).json({
                message: "All fields are required",
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
