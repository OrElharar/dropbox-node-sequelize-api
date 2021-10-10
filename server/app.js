const cors = require('cors')
const express = require("express")

const fileRouter = require("./routers/fileRouter");
const userRouter = require("./routers/userRouter");

const app = express();

app.use(express.json());
app.use(cors());
app.use(fileRouter);
app.use(userRouter);

app.use("/", (req, res) => {
    res.send("ok")
})

module.exports = app;