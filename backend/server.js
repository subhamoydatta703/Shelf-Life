require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const dbConnect = require("./config/db");

dbConnect();

app.use(cors());
app.use(express.json());
app.use("/api/auth", require("./routes/userRoutes"));
app.get("/", (req, res) => {
    res.send("Home route");
});

const port = process.env.PORT || 3000 

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});