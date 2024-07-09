import InvoiceModel from "../models/orderModel.js";

export const addOrder = async (req, res) => {
    try {
        const { InvoiceNo, customer, products, paid, payment } = req.body;
        const invoice = new InvoiceModel({ InvoiceNo, customer, products, paid, payment });
        const result = await invoice.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getAllOrders = async (req, res) => {
    try {
        const getOrders = await InvoiceModel.find()
        res.status(200).json(getOrders)

    } catch (error) {
        console.log(error)

    }
}


export const countOrders = async (req, res) => {
    try {
        const countAllOrders = await InvoiceModel.countDocuments({ type: "products" })
        res.status(200).json(countAllOrders)

    } catch (error) {
        console.log(error)

    }
}

// ------------- count all orders -------------

export const countAllOrders = async (req, res) => {
    try {
        const result = await InvoiceModel.countDocuments()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}


// --------------------------------------------------------
export const getOrderById = async (req, res) => {
    try {
        const id = req.params.id;
        const response = await InvoiceModel.findById(id)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const DeleteById = async (req, res) => {
    try {
        const id = req.params.id
        const response = await InvoiceModel.findByIdAndDelete(id)
        res.status(200).json(response)

    } catch (error) {
        console.log("Error: Cant Delete Order", error)
    }
}

export const UpdateOrder = async (req, res) => {
    try {
        const id = req.params.id
        const response = await InvoiceModel.findByIdAndUpdate(id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log('Can not update order', error)
    }
}

//------------ finding order where status is unpaid

export const findUnpaidCustomerBill = async (req, res) => {
    try {
        const { customerId } = req.params;
        const orders = await InvoiceModel.find({ customer_id: customerId, paid: false });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};