import companyModel from "../models/companModel.js"


export const addCompanyDetails = async (req, res) => {
    try {
        const { companyName, email, phone, Address } = req.body
        const addDetails = new companyModel({
            companyName: companyName,
            email: email,
            Address: Address,
            phone: phone,
        })
        const result = await addDetails.save()
        res.status(200).json({ success: "true", message: "Company details added", result: result })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: "flase", message: "Error occrued:" })
    }
}

export const UpdateByid = async (req, res) => {
    try {
        const getDetails = await companyModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(getDetails)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: "false", message: "Error occrued: " })
    }
}

export const showDetails = async (req, res) => {
    try {
        const showAll = await companyModel.find()
        res.status(200).json(showAll)
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: "flase", message: "Error occrued: " })
    }
}

export const getCompanyById = async(req, res)=>{
    try {
        const response = await companyModel.findById(req.params.id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
        
    }
}