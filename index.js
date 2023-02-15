const express = require("express");
const app = express();
const ytmp3 = require("./api/ytmp3");

app.use(express.json({ extended: false }));

app.use("/api/ytmp3", ytmp3);

app.listen(8000, () => console.log("Done."))
