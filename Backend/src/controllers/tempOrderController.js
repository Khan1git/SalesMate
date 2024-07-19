import tempInvoice from "../models/tempOrderModel.js";

export const addTempOrder = async (req, res) => {
    try {
        const { InvNo, name, products, paid } = req.body;
        const invoice = new tempInvoice({ InvNo, name, products, paid });
        const result = await invoice.save();
        res.status(201).json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


export const getTempById = async (req, res) => {
    try {
        const id = req.params.id
        const findTempById = await tempInvoice.findById(id)
        res.status(200).json(findTempById)
    } catch (error) {
        console.log(error, "error in the getTempOrder")
    }
}


export const getAllTempInvoices = async(req, res)=>{
    try {
        const response = await tempInvoice.find()
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

export const updateTempOrder = async(req, res)=>{
    try {
        const id = req.params.id
        const response = await tempInvoice.findByIdAndUpdate(id, req.body)
        res.status(200).json(response)
    } catch (error) {
        res.status(401).json({
            message: error
        })
        console.log(error,'error while updating the temporary order')
    }
}

export const deleteTempOrderById = async(req, res)=>{
    try {
        const id = req.params.id
        const response = await tempInvoice.findByIdAndDelete(id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error, 'Failed To Delete Temp order')
        
    }
}