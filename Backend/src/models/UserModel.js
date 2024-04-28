import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    age:{
        type: Number,
        required: true
    },
    password: {
        type: String,
        required: true,
        minlength: [5, 'Password must be at least 6 characters long'],
    }

}, { timestamps: true })

const UserModel = mongoose.model("user", userSchema)
export default UserModel 