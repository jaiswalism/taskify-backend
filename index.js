const dotenv = require("dotenv");
dotenv.config();

const express = require("express");
const cors = require('cors');
const todoRoutes = require('./routes/todo');
const userRoutes = require('./routes/user');

const app = express();
const port = process.env.PORT;
app.use(cors({
    origin: "https://taskflow-zen.vercel.app",
    credentials: true
}));
app.use(express.json());

//  Routes
app.use('/', userRoutes)
app.use('/', todoRoutes)

app.listen(port, ()=> console.log(`server is running at http://localhost:${port}`));

