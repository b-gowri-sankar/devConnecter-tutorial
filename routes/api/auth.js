const express = require('express')
const User = require('../../models/Users')
const { check , validationResult } = require('express-validator')
const router = express.Router();
const auth = require('../../middleware/auth')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')



//@route    GET api/Auth
// @desc    Test Route
//@access   public

router.get('/', auth ,async (req, res) => {
    try {
        console.log(req.user.id)
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    }
    catch (err) {
        console.error(err.message)
        res.status(500).send('Server Error')
    }

})

// router.porst('/:id', ( req, res)=> res.send('the use is created'))

router.post('/', [
    check('email', 'Enter Valid Email').isEmail(),
    check('password','Password is required').exists()
],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty){
            return req.status(400).json({ errors:errors.array() })
        }
        const { email, password } = req.body;

        try {
            let user = await User.findOne({ email });

            if (!user) {
                return res
                    .status(400)
                .json({errors:[{msg: 'Email or Password is Incorrect'}] })
            }
            const isMatch = await bcrypt.compare(password, user.password)
            
            if (!isMatch) {
                return res.status(400).json({errors:[{msg:' Email or Password is Incorrect'}]})
            }

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
            console.error(err.message)
            return res.status(500).send('Internal Server Error ')
        }
})

module.exports = router;