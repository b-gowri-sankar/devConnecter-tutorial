const jwt = require('jsonwebtoken');

const config = require('config')

module.exports = function (req, res, next){
    //Get Token  from header

    const token = req.header('x-auth-token');

    //check if no token

    if (!token) {
        return res.status(401).json({ message: 'No token, Authorization denied'})
    }

    try {
        const decoded = jwt.verify(token, config.get('jwtSecret'))
        req.user = decoded.user;
        next();

    }
    catch (err) {
        res.status(401).json({mesage: 'Token is not valid'})
    }

}