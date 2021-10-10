const express = require("express");

const User = require("../models/userModel");
const Token = require("../models/tokenModel");

const { userAuth } = require("../middlewares/userAuth");

const router = new express.Router();
// 

router.post("/users", async (req, res) => {
    const userData = { ...req.body };
    try {
        const user = await User.create(userData);
        await user.save();
        const token = await user.generateAuthToken();
        await Token.create({ userId: user.id, token });
        res.status(201).send({ user, token });
    } catch (err) {
        return res.status(400).send({
            status: 400,
            message: err.message
        })
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password);
        const token = await user.generateAuthToken();
        await Token.create({ userId: user.id, token });

        res.send({ user, token });
    } catch (err) {
        res.status(400).send({
            status: 400,
            message: err.message
        })
    }
})

router.post("/users/logout", userAuth, async (req, res) => {
    try {

        await Token.destroy({ where: { token: req.token } })
        res.send();
    } catch (err) {
        res.status(500).send();
    }
})

router.delete("/users", userAuth, async (req, res) => {
    try {
        await User.destroy({ where: { id: req.user.id } })
        res.send();
    } catch (err) {
        res.status(500).send();
    }
})




module.exports = router;