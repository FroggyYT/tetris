const express = require("express");
const JSONdb = require("simple-json-db");
const app = express();

const db = new JSONdb("weights.json");

app.use(express.static(`${__dirname}/dist`));

app.get("/p5", (req, res) => res.sendFile(`${__dirname}/node_modules/p5/lib/p5.min.js`));

app.listen(3000 || process.env.PORT, () => {

});