const express = require('express')
const router = express.Router();
const gravatar = require('gravatar')
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const config = require('config')
const jwt = require('jsonwebtoken')
const User = require('../../models/Users')

//@route    POST api/users
// @desc    REGISTER USER
//@access   public

router.post('/',
    [
        check('name', 'Name is Required')
            .not()
            .isEmpty(),
        check('email', 'Please include a valid email')
            .isEmail(),
        check('password', 'Please enter a password with 6 or more characters')
        .isLength({min:6})

    ],
    async (req, res) => {
        // console.log(req.body)
        const errors = validationResult(req);
        // console.log(errors)
        if (!errors.isEmpty()) {
            return res.status(400).json({errors: errors.array()})
        }

        const { name, email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (user) {
                return res.status(400).json({ errors: [ { msg: ' User already Exists'}]})
            }

            const avatar = gravatar.url(email,{
                s: '200',
                r: 'pg',
                d:'mm'
            })

            user = new User({
                name,
                email,
                avatar,
                password
            });

            const salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt)
            await user.save();

            const payload = {
                user: {
                    id: user.id
                }
            }

            jwt.sign(payload,
                config.get('jwtSecret'),
                { expiresIn: 360000 },
                (err, token) => {
                if(err) throw err;
                    return res.json({ token });
            })

            
        }
        catch (err) {
            console.error(err.message);
            res.status(500).send('Server Error')
        }


        //see if user exists

        //Get Users gravatar

        //Encrypt password

        //return jsonwebtoken

    })

// router.porst('/:id', ( req, res)=> res.send('the use is created'))

module.exports = router;