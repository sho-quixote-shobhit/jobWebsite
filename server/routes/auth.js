const express = require('express')
const router = express.Router();
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require('crypto')
const nodemailer = require('nodemailer')
const sendgridtransport = require('nodemailer-sendgrid-transport')

const transporter = nodemailer.createTransport(sendgridtransport({
    auth: {
        api_key: process.env.mailKey
    }
}))

//signup

router.post('/signup', async (req, res) => {
    const { name, password, email, profession } = req.body;
    if (!email || !password || !name || !profession) {
        return res.json({ error: "Please complete the data" })
    }
    try {
        const userCheck = await User.findOne({ email: email });
        if (userCheck) {
            return res.json({ error: "User already exists!!" })
        }
        const hashedPass = await bcrypt.hash(password, 12);
        const newUser = new User({
            name, email,
            password: hashedPass,
            profession
        })
        await newUser.save().then((user) => {
            //sending email via sendgrid

            // transporter.sendMail({
            //     to: newUser.email,
            //     from: 'vipershob07@gmail.com',
            //     subject: 'Your Registration Was Successful!',
            //     html: `<h1>Dear , ${newUser.name}</h1> 
            //             <p>We are delighted to welcome you to Instagram! Thank you for choosing us as your platform for social media.</p>
            //             <p>Your registration process has been successfully completed, and you are now an official member of our community. Here are some key details about your account:</p>
            //             <p>Username : ${newUser.name} </p>
            //             <p>Email Address : ${newUser.email}</p>
            //             <p>Thank you for joining [Your Website Name]. We look forward to seeing you around and hope you have a fantastic experience on our platform</p>.

            //             <p>Best regards,</p>
                        
            //             <p>Instagram Team </p>`
            // })
            const { _id } = user;
            const token = jwt.sign({ _id: _id }, process.env.JWT_SEC)
            user.password = undefined
            res.json({ token, user })
        }).catch(err => {
            res.json({ msg: "error while saving" })
            console.log(err)
        })

    } catch (error) {
        res.json({ msg: "Server error" })
        console.log(error)
    }
})

//login

router.post('/signin', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.json({ error: "Please complete the data" })
    }
    try {
        const user = await User.findOne({ email: email }).populate('skills')
        if (!user) {
            return res.json({ error: "Invalid email or password" })
        }
        await bcrypt.compare(password, user.password).then((match) => {
            if (match) {
                //a token to user
                const { _id } = user;
                const token = jwt.sign({ _id: _id }, process.env.JWT_SEC)
                user.password = undefined
                res.json({ token, user })
            } else {
                return res.json({ error: "Invalid email or password" })
            }
        })

    } catch (error) {
        res.json({ message: "Server error" })
        console.log(error)
    }
})


//forgot password
router.post('/resetPassword', (req, res) => {
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err)
                return res.json({ error: 'Server error' })
            }
            const token = buffer.toString('hex')
            await User.findOne({ email: req.body.email }).then(async (user) => {
                if (!user) {
                    return res.json({ error: 'User doesnot exists!!' })
                }
                user.resetToken = token
                user.expireToken = Date.now() + 3600000
                await user.save().then((result => {
                    transporter.sendMail({
                        to: user.email,
                        from: 'vipershob07@gmail.com',
                        subject: 'password reset',
                        html: `
                            <h1>Dear , ${user.name}</h1>
                            <p>Your Request for resetting password</p>
                            <p>Click <a href = "http://localhost:3000/reset/${token}">link</a> </p>
                        `
                    })
                    res.json({ message: 'Check your email sometimes in spam folder' })
                }))
            })
        })
    } catch (error) {
        res.json({ error: 'server error!!' })
        console.log(error)
    }
})


//changing password
router.post('/newpassword', async (req, res) => {
    const { newpassword, token } = req.body
    if (!newpassword || !token) {
        return res.json({ error: 'Enter new password' })
    }
    try {
        await User.findOneAndUpdate({ resetToken: token }, {
            password: await bcrypt.hash(newpassword, 12)
        })
        res.json({message : 'password changed'})
    } catch (error) {
        res.json({ error: 'server error!!' })
        console.log(error)
    }
})

module.exports = router