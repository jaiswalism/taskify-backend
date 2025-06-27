const { Router } = require("express");
const router = Router();
const userMiddleware = require("../middleware/user");
const { User, Todo } = require('../database/index')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { z } = require('zod')

const SECRET = process.env.JWT_SECRET

// User Routes
router.post('/signup', async (req, res) => {
    // User signup logic
    try{
        const validateBody = z.object({
            name: z.string().min(2, {message: "Name is required!"}).max(50, {message: "Max length for name is 50 chars."}),
            email: z.string().email().min(5).max(50),
            password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&?%*]).{6,18}$/, {
                message: "Password must be 6-18 chars, include uppercase, lowercase, number, and special character"
            })
        })

        const parsedBody = validateBody.safeParse(req.body)
        
        if(!parsedBody.success){
            res.status(400).json({
                error: parsedBody.error.issues[0].message
            })
            return
        }

        const name = req.body.name
        const email = req.body.email
        const password = req.body.password

        const hashedPass = await bcrypt.hash(password, 10);

        await User.create({
            name: name,
            email: email,
            password: hashedPass
        })

        res.status(201).json({message: "Signup Successful!"})
    }catch(err){
        res.status(403).json({error: "Signup Failed!"})
        console.log(err)
    }
});

router.post('/login', async (req, res) => {
     // User login logic
     try{
        const validateBody = z.object({
            email: z.string().email().min(5).max(50),
            password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$&?%*]).{6,18}$/, {
                message: "Password must be 6-18 chars, include uppercase, lowercase, number, and special character"
            })
        })

        const parsedBody = validateBody.safeParse(req.body)
        
        if(!parsedBody.success){
            res.status(400).json({
                error: parsedBody.error.issues[0].message
            })
            return
        }        

        const email = req.body.email;
        const password = req.body.password;

        const user = await User.findOne({
            email: email
        })

        const verifiedUser = await bcrypt.compare(password, user.password)

        if(verifiedUser){
            const token = jwt.sign({
                userId: user._id
            }, SECRET, {
                
            });
            res.status(200).send({token: token})
        }else{
            res.status(401).json({error: "Unauthorized"})
        }

     }catch(err){
        console.log(err)
        res.status(403).json({error: "Login Failed"})
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