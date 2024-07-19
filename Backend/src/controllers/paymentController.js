import Payment from "../models/paymentModel.js";

export const addPayment = async (req, res) => {
    try {
        const { name, balance, date, amount, method } = req.body
        const payment = new Payment({ name, balance, date, amount, method })
        const result = await payment.save()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}


export const findPaymentById = async(req, res) =>{
    try {
        const id = req.params.id
        const response = await Payment.findById(id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const findAllPaymnets = async(req, res)=>{
    try {
        const response = await Payment.find()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const deletePaymentById = async(req, res)=> {
    try {
        const id = req.params.id
        const response = await Payment.findByIdAndDelete(id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error, "Failed to delete the paymnet")
    }
}