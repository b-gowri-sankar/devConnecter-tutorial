const express = require('express')
const auth = require('../../middleware/auth')
const { check, validationResult } = require('express-validator')
const request = require('request')
const router = express.Router();
const Profile = require('../../models/Profile')
const User = require('../../models/Users')
const config = require('config')
const Post = require('../../models/Posts')

//@route    GET api/profiles/me
// @desc    GET current users profile
//@access   public

router.get('/me',auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id }).populate('user', ['name', 'avatar']);
        if (!profile) {
           return res.status(400).json({ msg:'there is no profile for this User'})
        }
        res.json(profile)
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('server error')
    }
})

//@route    POST api/profiles
// @desc    Create or Update user profile
//@access   private


router.post('/',
    [auth,
        [
            check('status', 'Status is Required')
                .not()
                .isEmpty(),
            check('skills', 'skills is required')
                .not()
                .isEmpty(),
        ]
    ],
    async (req, res) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
           return res.status(400).json({error: errors.array()})
        }
        const {
            company,
            website,
            location,
            bio,
            status,
            githubusername,
            skills,
            youtube,
            facebook,
            twitter,
            instagram,
            linkedin
        } = req.body;

        //Build Profile object

        const profileFields = {};

        profileFields.user = req.user.id;
        if (company) profileFields.company = company;
        if (website) profileFields.website = website;
        if (location) profileFields.location = location;
        if (bio) profileFields.bio = bio;
        if (status) profileFields.status = status;
        if (githubusername) profileFields.githubusername = githubusername;
        if (skills) {
            profileFields.skills = skills.split(',').map(skill => skill.trim())
        }

        //Build Social object

        profileFields.social = {};

        if (youtube) profileFields.social.youtube = youtube;
        if (twitter) profileFields.social.twitter = twitter;
        if (facebook) profileFields.social.facebook = facebook;
        if (linkedin) profileFields.social.linkedin = linkedin;
        if (instagram) profileFields.social.instagram = instagram;


        try {
            let profile =await Profile.findOne({ user: req.user.id });
            if (profile) {
                //update
                profile = await Profile.findOneAndUpdate(
                    { user: req.user.id },
                    { $set: profileFields },
                    { new: true })
                return res.json(profile)
            }
            profile = new Profile(profileFields);

            await profile.save();
            return res.json(profile)
        }
        catch (err) {
            console.error(err.message)
            return res.status(500).send('Internal Server Error')
        }

    })

//@route    POST api/profiles
// @desc    GET ALL THE PROFILES
//@access   PUBLIC

router.get('/', async (req, res) => {
    try {
        
        const profiles = await Profile.find().populate('user', ['name', 'avatar']);
        return res.json(profiles)
    } catch (err) {
        console.error(err.message)
        console.status(500).send('Internal Server Error')
    }
})

//@route    POST api/profiles/user/:user_id( userid )
// @desc    GET single Profile by UserID
//@access   PUBLIC
router.get('/user/:user_id', async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user', ['name', 'avatar'])

        if(!profile) return res.status(400).json({msg:'Profile not Found'})

        return res.json(profile)
    }
    catch (err) {
        console.error(err.message)
        if (err.kind == 'ObjectId') {
            return res.status(400).json({msg:'Profile not Found'})
        }
        res.status(500).send("internal Server Error")
    }
})
//@route    DELETE api/profiles/me
// @desc    Delete Current Profile, user and posts
//@access   Private

router.delete('/',auth, async (req, res) => {
    try {
        //@todo - remove users posts
        await Post.deleteMany({user: req.user.id})
        //remove Profile
        await Profile.findOneAndRemove({ user: req.user.id })
        await User.findOneAndRemove({ _id: req.user.id })
        res.json({msg:'User deleted'})
    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Internal Server Error')
    }
}
)

//@route    PUT api/profiles
// @desc    ADd Profile ecperiesnce
//@access   Private

router.put('/experience', [auth,
    [
        check('title', "title is required")
            .not()
            .isEmpty(),
        check('company', "company is required")
            .not()
            .isEmpty(),
        check('location', 'location is required')
            .not()
            .isEmpty(),
        check('from', 'from is Required')
            .not()
            .isEmpty(),
    ]
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() })
        
        const {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        } = req.body
        const newExp = {
            title,
            company,
            location,
            from,
            to,
            current,
            description
        }

        const profile = await Profile.findOne({ user: req.user.id })
        
        profile.experience.unshift(newExp)
        await profile.save()

        res.json(profile)

    } catch (err) {
        console.error(err.message)
         return res.status(500).send('internal server error')
        
    }
})
//@route    Delete api/profiles/experience/:exp_id
// @desc    delete profile experience
//@access   Private

router.delete('/experience/:exp_id', auth, async (req, res) => {
    try {
        
        const profile = await Profile.findOne({ user: req.user.id });

        //get remove index of experience
        const removeIndex = profile.experience.map(item => item.id).indexOf(req.params.exp_id)

        if (removeIndex < 0)
            return res.status(400).send('The Experience is Not Found')
        profile.experience.splice(removeIndex, 1);

        await profile.save()
        res.json(profile)

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Internal Server Error')
    }
})

//@route    PUT api/profiles
// @desc    ADd Profile education
//@access   Private


router.put('/education',
    [auth, [
        check('school', 'school is required')
            .not()
            .isEmpty(),
        check('degree', 'degree is required')
            .not()
            .isEmpty(),
        check('fieldofstudy', 'Field of Study is required')
            .not()
            .isEmpty(),
        check('from', 'from is required')
            .not()
            .isEmpty(),
    
    ]
    ],
    async (req, res) => {
    try {
        
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors:errors.array()})
        }

        const {
            school,
            degree,
            fieldofstudy,
            from,
            to,
            current,
            description
        } = req.body;
        const profile = await Profile.findOne({ user: req.user.id })
        profile.education.unshift({ school, degree, fieldofstudy, from, to, current, description })
        
        

        await profile.save()

        return res.json(profile)

    } catch (err) {
        console.error(err.message)
        return res.status(500).send('Internal Server Error')
    }
    })
//@route    DELETE api/profiles/education
// @desc    DELETE eduction from the education field
//@access   Private

router.delete('/education/:edu_id', auth, async (req, res) => {
    try {
        const profile = await Profile.findOne({ user: req.user.id })
        
        const removeIndex = profile.education.map(item => item.id).indexOf(req.params.edu_id)

        if (removeIndex < 0)
            return res.status(400).json({ error: 'Bad Request' })
        
        profile.education.splice(removeIndex, 1)

        await profile.save()
        res.json(profile)

    }
    catch (err) {
        console.error(err.message)
        return res.status(500).send('Internal Server Error')
    }
    
})


//@route    GET api/profiles/github/:username
// @desc    Get user repos from github
//@access   public

router.get('/github/:username', (req, res) => {
    try {

        const options = {
            uri: `https://api.github.com/users/${req.params.username}/repos?per_page=5&
            sort=created:asc&client_id=${config.get('githubClientId')}&client_secret=${config.get('githubSecret')}`,
            method: 'GET',
            headers: { 'user-agent': 'node.js' }
        };
        
        request(options, (error, response, body) => {
            if (error)
                console.error(error.message)
            if (response.statusCode != 200)
               return res.status(400).json({ msg: 'No Github Profile found' })
            return res.json(JSON.parse(body))
        })

    } catch (err) {
        console.error(err.message)
        res.status(500).send('Inernal Server Error')
    }
})


module.exports = router;