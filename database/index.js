const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

// Connect to MongoDB
const mongoURL = process.env.MONGO_URI
mongoose.connect(mongoURL);

// Schemas

const TodoSchema = new mongoose.Schema({
    userId: ObjectId,
    title: String,
    description: String,
    tag: String,
    deadline: Date,
    section: String,
    done: Boolean 
})

const UserSchema = new mongoose.Schema({
    name: String,
    email: {type: String, unique: true},
    password: String
})

const Todo = mongoose.model("todos", TodoSchema);
const User = mongoose.model("users", UserSchema);

module.exports = {
    Todo,
    User
}