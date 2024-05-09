const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const User = require('../models/User')

module.exports = (req, res, next) => {
    const { authorization } = req.headers;
    if (!authorization) {
        return res.json({ error: "Login required!!" })
    }
    const token = authorization.replace("Bearer ", "");
    jwt.verify(token, process.env.JWT_SEC, async(err, payload) => {
        if (err) {
            return res.json({ error: "Login required!!" })
        }
        const { _id } = payload
        const userData = await User.findById(_id);
        userData.password = undefined
        req.user = userData
        next();
    })
}