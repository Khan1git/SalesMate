import mongoose from 'mongoose'

const CompanySchema = new mongoose.Schema({
    companyName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    phone: {
        type: Number,
        required: true
    },
    Address: {
        type: String,
        required: true
    },
})

const companyModel = mongoose.model("company", CompanySchema)
export default companyModel;
