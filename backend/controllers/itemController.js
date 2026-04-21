const Item = require("../models/item");

exports.createItem = async (req, res) => {

    try {
        const { name, addedBy, category, householdId, expiaryDate, quantity, status } = req.body;
        if (!name || !householdId || !expiaryDate || !addedBy || !quantity) {
            return res.status(400).json({
                message: "All fields are required",
            })

        }
        const thisItem = await  Item.create({
            name: name,
            addedBy: addedBy,
            category: category,
            householdId: householdId,
            expiaryDate: expiaryDate,
            quantity: quantity,
            status: status,
        })
        return res.status(201).json({
            message: "Item created successfully",
            item: thisItem,
        })


    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal server error",
        })
    }

}