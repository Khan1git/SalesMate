import mongoose from 'mongoose'

const customerSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true
    },
    Address:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    AccountBalance:{
        type: Number,
        required: true
    }
}, {timestamps: true})

const CustomerModel = mongoose.model("customerModel", customerSchema)
export default CustomerModel