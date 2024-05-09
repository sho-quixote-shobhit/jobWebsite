const express = require('express')
const router = express.Router();
const requireLogin = require('../middlewares/requireLogin')
const axios = require('axios')
const Profile = require('../models/Profile')
const User = require('../models/User')
const Job = require('../models/Job')

const multer = require('multer')
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files');
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now()
        cb(null, uniqueSuffix + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: { fieldSize: 25 * 1024 * 1024 }
});

router.get('/getprofiles', requireLogin, async (req, res) => {
    const keyword = req.query.search ? {
        profile: { $regex: req.query.search, $options: "i" }
    } : {}

    try {
        await Profile.find(keyword).then(profiles => {
            res.json({ profiles })
        })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.put('/addprofile', requireLogin, async (req, res) => {
    const { newprofile } = req.body;
    if (!newprofile) return res.json({ error: 'Add a profile!!' });

    try {
        const UpdatedUser = await User.findByIdAndUpdate(req.user._id, { profile : newprofile._id }, { new: true }).populate('profile')
        UpdatedUser.password = undefined
        res.json({ user: UpdatedUser })
    } catch (error) {
        console.log(error);
        return res.json({ error });
    }
});

router.put('/addskill', requireLogin, async (req, res) => {
    const { skill } = req.body;
    if (!skill) return res.json({ error: 'No skill mentioned!!' });

    try {
        const user = await User.findOneAndUpdate(
            {
                _id: req.user._id,
                skills: { $ne: skill } 
            },
            {
                $push: { skills: skill }
            },
            { new: true }
        ).populate('profile');

        if (!user) {
            return res.json({ error: 'Skill already exists!!' });
        }

        user.password = undefined;
        res.json({ user });
    } catch (error) {
        console.log(error);
        return res.json({ error });
    }
});

router.put('/removeskill', requireLogin, async (req, res) => {
    const { skill } = req.body;
    if (!skill) return res.json({ error: 'No skill mentioned!!' })

    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            $pull: { skills: skill }
        }, { new: true }).populate('profile')
        user.password = undefined
        res.json({ user })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.put('/updateprofile', requireLogin, async (req, res) => {
    const { newname, newemail } = req.body;
    if (!newemail || !newname) return res.json({ error: 'Enter all the fields!!' })

    try {
        if (newemail !== req.user.email) {
            const userCheck = await User.findOne({ email: newemail });
            if (userCheck) {
                return res.json({ error: "User with this credentials exists!!" })
            }
        }
        const user = await User.findByIdAndUpdate(req.user._id, { name: newname, email: newemail }, { new: true }).populate('profile')
        user.password = undefined
        res.json({ user })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.post('/addresume', upload.single('file'), requireLogin, async (req, res) => {
    try {
        if (!req.file.path) {
            return res.json({ error: 'Add a resume!!' })
        } else {
            const ResumeCheck = await User.findById(req.user._id);
            if (ResumeCheck.resume !== 'no') {
                const filePath = `./files/${ResumeCheck.resume}`;
                if (fs.existsSync(filePath)) {
                    fs.unlink(filePath, (err) => {
                        if (err) {
                            console.error('Error deleting file:', err);
                        } else {
                            console.log('Resume Deleted!!');
                        }
                    });
                } else {
                    console.log('File does not exist');
                }
            }
            const resume = req.file.filename
            const user = await User.findByIdAndUpdate(req.user._id, { resume }, { new: true }).populate('profile')
            user.password = undefined
            res.json({ user })
        }
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.put('/addpic', requireLogin, async (req, res) => {
    const { imgurl } = req.body;
    if (!imgurl) return res.json({ error: 'No Image' })

    try {
        const user = await User.findByIdAndUpdate(req.user._id, {
            photo: imgurl
        }, { new: true }).populate('profile')
        user.password = undefined
        res.json({ user })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.put('/deleteresume', requireLogin, async (req, res) => {
    const { resume } = req.body;
    if (!resume) return res.json({ error: 'No resume!!' })
    try {
        const filePath = `./files/${resume}`;
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, (err) => {
                if (err) {
                    console.error('Error deleting file:', err);
                } else {
                    console.log('Resume Deleted!!');
                }
            });
        } else {
            console.log('File does not exist');
        }

        const user = await User.findByIdAndUpdate(req.user._id, { resume: 'no' }, { new: true }).populate('profile')
        user.password = undefined
        res.json({ user })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.post('/addjob', requireLogin, async (req, res) => {
    const {profile , seats , company , skills , description } = req.body;
    if(!profile || !seats || !company || !skills) return res.json({error : 'Complete the job requirements!!'})

    if(req.user.profession === 'Student') return res.json({error : 'You are not a recruiter!!'})

    try {
        const newJob = new Job({
            profile,
            seats,
            company,
            recruiter : req.user,
            skills,
            description
        })

        await newJob.save();

        await axios.post('http://127.0.0.1:8080/add_data' , {job_id : newJob._id , skills}).then(res => {
            console.log(res.data)
        })


        const user = await User.findByIdAndUpdate(req.user._id , {$push : {jobs : newJob}} , {new : true})
        user.password = undefined
        res.json({user})
    } catch (error) {
        console.log(error)
        return res.json({error})
    }
})

router.get('/jobsoffered' , requireLogin , async(req,res) => {
    const userId = req.user._id
    const jobs = await Job.find({recruiter : userId}).populate('profile')
    res.send(jobs)
})

router.put('/deletejob' , requireLogin , async(req,res) => {
    const {jobId} = req.body;
    if(!jobId) return res.json({error : 'No job mentioned!!'})
    try {
        const user = await User.findByIdAndUpdate(req.user._id , {$pull : {jobs : jobId}} , {new : true}).populate('jobs')
        await Job.findByIdAndDelete(jobId)
        const jobs = await Job.find({recruiter : req.user._id}).populate('profile')
        res.json({user , jobs})
    } catch (error) {
        console.log(error)
        return res.json({error})
    }
})



module.exports = router