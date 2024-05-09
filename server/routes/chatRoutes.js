const express = require('express')
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin');
const Chat = require('../models/Chat')

//fetchchats of logged in user
router.get('/', requireLogin, async (req, res) => {
    try {
        //matching all the chats where current logged in user is present
        await Chat.find({users : {$elemMatch : {$eq : req.user._id}}})
        .populate('users' , '-password')
        .populate({ path: 'latestMessage', populate: { path: 'sender', select: '-password' } })
        .sort({updatedAt : -1})
        .then((chats)=>{
            res.json({chats})
        })
    } catch (error) {
        res.json({error : 'server error!!'})
        console.log(error)
    }
})

//create chat or access existing chat
router.post('/', requireLogin, async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        return res.json({ error: "No userId" })
    }

    try {
        const isChat = await Chat.find({
            $and: [
                { users: { $elemMatch: { $eq: req.user._id } } },
                { users: { $elemMatch: { $eq: userId } } },
            ],
        }).populate('users', '-password').populate({ path: 'latestMessage', populate: { path: 'sender', select: '-password' } });

        if (isChat.length > 0) {
            res.json( isChat[0] )
        } else {
            try {
                const createChat = new Chat({
                    chatName: 'sender',
                    users: [req.user._id, userId]
                })
                await createChat.save().then((newChat) => {
                    newChat.populate('users' , '-password').then(()=>{
                        res.json(newChat)
                    })
                })
            } catch (error) {
                res.json({ error: 'Server error!' })
                console.log(error)
            }
        }
    } catch (error) {
        res.json({ error: 'Server error!' })
        console.log(error)
    }
})

module.exports = router