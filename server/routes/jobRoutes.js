const express = require('express')
const router = express.Router();
const User = require('../models/User')
const Job = require('../models/Job');
const Application = require('../models/Application')
const requireLogin = require('../middlewares/requireLogin');
const axios = require('axios')
const fs = require('fs')

router.get('/homepage', requireLogin, async (req, res) => {
    if (req.user._id && req.user.profession === 'Student') {

        //ml model for specific jobs for the student
        const jobs = await Job.find({}).populate('profile').populate('recruiter')
        res.json({ jobs: jobs })

    } else if (req.user._id && req.user.profession === 'Recruiter') {
        const applications = await Application.find({ recruiter: req.user._id }).populate('student', '-password').populate({
            path: 'job',
            populate:
                { path: 'profile' }
        })
        res.json({ applications })
    }
})

router.post('/applyjob', requireLogin, async (req, res) => {
    const { jobId, recId } = req.body;
    if (!jobId || !recId) return res.json({ error: 'No job mentioned!!' });

    try {
        const JobToApply = await Job.findOne({ _id: jobId })
        if (JobToApply.appliedBy.includes(req.user._id)) {
            return res.json({ error: 'Already Applied!!' })
        }
        const newApp = new Application({
            student: req.user._id,
            recruiter: recId,
            job: jobId
        })

        await newApp.save()
        await Job.findByIdAndUpdate(jobId, { $push: { appliedBy: req.user._id } }, { new: true })
        const jobs = await Job.find({}).populate('profile').populate('recruiter')
        res.send(jobs)

    } catch (error) {
        console.log(error);
        return res.json({ error })
    }
})

router.get('/getmyapplications', requireLogin, async (req, res) => {
    try {
        const applications = await Application.find({ student: req.user._id })
            .populate({
                path: 'job',
                populate: [
                    { path: 'profile' },
                    { path: 'recruiter', select: '-password' }
                ]
            });

        res.json({ applications });
    } catch (error) {
        console.log(error);
        return res.json({ error });
    }
});

router.get('/searchjob/:jobTitle', requireLogin, async (req, res) => {
    const { jobTitle } = req.params;

    const matching = (str1, str2) => {
        const lowerStr1 = str1.toLowerCase();
        const lowerStr2 = str2.toLowerCase();
        const maxLength = Math.max(lowerStr1.length, lowerStr2.length);
        let matchingCount = 0;

        for (let i = 0; i < maxLength; i++) {
            if (lowerStr1[i] === lowerStr2[i]) {
                matchingCount++;
            }
        }
        const percentage = (matchingCount / maxLength) * 100;
        return percentage;
    };

    try {
        const formattedSearch = jobTitle.replace(/%20/g, " ");
        const jobs = await Job.find({}).populate('profile').populate('recruiter')
        const similarJobs = [];

        jobs.forEach((job) => {
            if (matching(job.profile.profile, formattedSearch) >= 50) {
                similarJobs.push(job)
            }
        })
        res.json({ jobs: similarJobs })

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/getapp/:appId', requireLogin, async (req, res) => {
    const { appId } = req.params;
    if (!appId) return res.json({ error: 'No application!!' })
    try {
        const application = await Application.findById(appId).populate({
            path: 'student', select: '-password',
            populate: {
                path: 'profile'
            }
        }).populate({
            path: 'job',
            populate: {
                path: 'profile'
            }
        })
        res.json({ application })
    } catch (error) {
        console.log(error)
    }
})

router.get('/analyse/:appId', requireLogin, async (req, res) => {
    const { appId } = req.params;
    if (!appId) return res.json({ error: 'No resume attached!!' });

    try {
        const application = await Application.findById(appId).populate({
            path: 'student', select: '-password',
            populate: {
                path: 'profile'
            }
        }).populate({
            path: 'job',
            populate: {
                path: 'profile'
            }
        })
        const resume = application.student.resume
        const description = application.job.description

        const filePath = __dirname + `/../files/${resume}`;
        if (!fs.existsSync(filePath)) {
            return res.json({ error: 'File not found' });
        }

        const file = await fs.openAsBlob(filePath);
        const formData = new FormData();
        formData.set('file', file, filePath.substring(filePath.lastIndexOf('/') + 1));
        formData.append('description', description);

        const response = await axios.post('http://127.0.0.1:8080/resume_analyse', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        let resString = "" + response.data;
        resString = resString.substring(6);
        resString = resString.slice(0, -3);


        resString = resString.replace(/'/g, '"');
        const matchRegex = /"JD Match"\s*:\s*"(\d+%?)"/;
        const keywordsRegex = /"MissingKeywords"\s*:\s*\[([^\]]*)\]/;
        const summaryRegex = /"Profile Summary"\s*:\s*"([^"]*)"/;

        const matchMatch = resString.match(matchRegex);
        const keywordsMatch = resString.match(keywordsRegex);
        const summaryMatch = resString.match(summaryRegex);

        if (!matchMatch || !keywordsMatch || !summaryMatch) {
            console.error("Unable to extract required information from input string.");
        } else {
            const match = matchMatch[1];
            const keywords = keywordsMatch[1].split(',');
            const summary = summaryMatch[1];

            const cleanedKeywords = keywords.map(keyword => keyword.trim().replace(/"/g, ''));

            const result = {
                match: match,
                missing: cleanedKeywords,
                summary: summary
            };

            res.json({result}); 
        }

    } catch (error) {
        console.error(error);
        return res.json({ error: 'Server error' });
    }
});

router.put('/accept', requireLogin, async (req, res) => {
    const { appId } = req.body;
    if (!appId) return res.json({ error: 'No Application!!' })
    try {
        // await Application.findByIdAndUpdate(appId , {
        //     status : 'accepted'
        // } , {new : true})

        const app = await Application.findById(appId)
        const JobProfile = await Job.findById(app.job)
        if (JobProfile.seats === 0) {
            return res.json({ error: 'No seats available!!' })
        }

        JobProfile.seats = JobProfile.seats - 1;
        await JobProfile.save();

        app.status = 'accepted';
        await app.save().then(updatedApp => {
            res.send('ok')
        }).catch(error => {
            res.json({ error })
        })
    } catch (error) {
        console.log(error)
        return res.json({ error })
    }
})

router.put('/reject', requireLogin, async (req, res) => {
    const { appId } = req.body;
    if (!appId) return res.json({ error: 'No application!!' })
    try {
        await Application.findByIdAndUpdate(appId, {
            status: 'rejected'
        }, { new: true })
        res.send('ok')
    } catch (error) {
        return res.json({ error })
    }
})

router.get('/:jobId/applications', requireLogin, async (req, res) => {
    const { jobId } = req.params;

    if (!jobId) return res.json({ error: 'No Job provided!!' })

    try {
        const applications = await Application.find({ job: jobId }).populate('student', '-password').populate({
            path: 'job',
            populate:
                { path: 'profile' }
        })
        res.json({ applications })
    } catch (error) {
        return res.json({ error })
    }
})

router.get('/recommended', requireLogin, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        const skills = user.skills;

        const response = await axios.post('http://127.0.0.1:8080/recommend_jobs', { skills });
        const ids = response.data.job_id;

        const jobPromises = ids.map(async (id) => {
            const job = await Job.findById(id).populate('profile').populate('recruiter');
            return job;
        });

        const recommended = await Promise.all(jobPromises);

        res.json({ jobs: recommended });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



module.exports = router