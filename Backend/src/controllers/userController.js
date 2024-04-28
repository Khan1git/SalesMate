import { validationResult } from 'express-validator';
import bcryptjs from 'bcryptjs';
import UserModel from '../models/UserModel.js';

export const RegisterUser = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { username, email, password, age } = req.body;
        const hashedPass = bcryptjs.hashSync(password, 10);
        
        const newUser = new UserModel({
            username: username,
            password: hashedPass,
            email: email,
            age: age,
        });

        const savedUser = await newUser.save();
        res.status(201).json({ success: true, user: savedUser });
    } catch (error) {
        console.error('Error registering user:', error.message);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};


export const LoginUser = async(req, res) =>{
    try {
        const { email, password } = req.body;
        const result = await UserModel.findOne({ email: email });
        if (!result) {
            return res.status(400).json({ error: "Wrong Credentials. Please try again." });
        }
        const VaidPass =  bcryptjs.compareSync(password, result.password);
        if (!VaidPass) {
            return res.status(400).json({ error: "Wrong Credentials. Please try again." });
        }
        return res.json(result).status(200)
        
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
        console.log(error)
        
    }
}