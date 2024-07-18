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
