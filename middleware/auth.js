const jwt = require('jsonwebtoken');

function auth(req, res, next) {
    try {
        const token = req.headers.authorization.split(" ")[1];
        if (!token) return res.status(401).send('Access denied. No token provided')

        const decoded = jwt.verify(token, process.env.jwtPrivateKey)
        req.user = decoded;
        next();

    } catch (error) {
        res.status(401).json({message: "Auth failed"})
    }
}

module.exports = auth;