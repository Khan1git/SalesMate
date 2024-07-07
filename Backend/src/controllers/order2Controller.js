import tempInvoiceModel from "../models/order2Mode.js";

export const tempInvoice = async (req, res) => {
    try {
        const { No,customer, products, paid } = req.body;
        const invoice = new tempInvoiceModel({  No, customer, products, paid });
        const result = await invoice.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
