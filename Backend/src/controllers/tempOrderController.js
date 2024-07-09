import tempInvoice from "../models/tempOrderModel.js";

export const addTempOrder = async (req, res) => {
    try {
        const { InvNo,customer, products, paid } = req.body;
        const invoice = new tempInvoice({ InvNo, customer, products, paid });
        const result = await invoice.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};