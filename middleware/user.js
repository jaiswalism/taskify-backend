const jwt = require("jsonwebtoken")

const SECRET = process.env.JWT_SECRET;

function userMiddleware(req, res, next) {
    // Auth logic
    try{
        const token = req.headers.token;
        req.token = token
        const verifiedId = jwt.verify(token, SECRET);


        req.userId = verifiedId.userId
        next();
    }catch(err){
        res.status(401).send()
        console.log(err)
    }
}

module.exports = userMiddleware;