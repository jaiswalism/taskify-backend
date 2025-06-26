const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Todo } = require('../database/index')
const jwt = require('jsonwebtoken')

const SECRET = process.env.JWT_SECRET

// User Routes
router.post('/signup', async (req, res) => {
    // User signup logic
    try{
        const name = req.body.name;
        const email = req.body.email;
        const password = req.body.password;


        await User.create({
            name: name,
            email: email,
            password: password
        })

        res.status(201).json({message: "Signup Successful!"})
    }catch(err){
        res.status(403).json({message: "Signup Failed!"})
        console.log(err)
    }
});

router.post('/login', async (req, res) => {
     // User login logic
     try{
        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email,
            password: password
        })


        if(user){
            const token = jwt.sign({
                userId: user._id
            }, SECRET, {
                
            });
            res.status(200).send({token: token})
        }else{
            res.status(401).json({message: "Unauthorized"})
        }

     }catch(err){
        console.log(err)
        res.send(403).json({message: "Login Failed"})
     }
});

router.get('/todos', userMiddleware, async(req, res) => {
    // Logic for getting todos for a user
    try{
        const userId = req.userId;
        
        const todos = await Todo.find({
            userId : userId
        })

        res.status(200).send({todos: todos})
    }catch(err){
        console.log(err)
        res.status(403).json({message: "Failed to get todos"})
    }
});

router.post('/logout', userMiddleware, (req, res) => {
    // Implement logout logic
    const userId = req.userId
    const token = req.token

    res.status(200).send("Logout Successful!")
        
});

module.exports = router