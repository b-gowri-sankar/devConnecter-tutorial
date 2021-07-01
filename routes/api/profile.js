const express = require('express')

const router = express.Router();


//@route    GET api/profiles
// @desc    Test Route
//@access   public

router.get('/', (req, res) => {
    return res.send('profiles Route')
})

// router.porst('/:id', ( req, res)=> res.send('the use is created'))

module.exports = router;