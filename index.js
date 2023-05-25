const express = require("express");
const app = express();

const db = require("./config/connection");

const allRoutes = require("./controllers");
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(allRoutes);

db.once("open", () => {
    app.listen(PORT, () => {
        console.log(`API server running on port ${PORT}`);
    });
});