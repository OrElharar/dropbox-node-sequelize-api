const jwt = require("jsonwebtoken");
const Token = require("../models/tokenModel");
const User = require("../models/userModel");

const userAuth = async (req, res, next) => {
    try {
        const token = req.header("Authorization").replace("Bearer ", "")
        await confirmAuthByToken(req, token);
        console.log("Finished confirmAuthByToken");
        next();
    } catch (err) {
        res.status(401).send({ status: 401, message: "Authorization failed." })
    }
}

const confirmAuthByToken = async (req, token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_USER);
    const getToken = await Token.findOne({
        limit: 1,
        where: {
            token,
            userId: decoded._id
        }
    })

    const user = await User.findOne({
        limit: 1,
        where: {
            id: getToken.dataValues.userId,
        }
    })
    // console.log("After getUser", { user, token });

    req.user = user
    req.token = token
}
module.exports = { userAuth, confirmAuthByToken };

