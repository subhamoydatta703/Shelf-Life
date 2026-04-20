const mongoose = require('mongoose');

async function dbConnect() {

    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("DB Connedted");

    } catch (error) {
        console.log("DB not connected", error);

    }
}

module.exports = dbConnect;