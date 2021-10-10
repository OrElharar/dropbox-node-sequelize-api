const app = require("./app");

const port = process.env.PORT;
const sequlize = require("./db/sequelize")

sequlize.sync()
    .then(() => app.listen(port, () => console.log("Server connected, port:", port)))
    .catch(err => console.log({ err }))