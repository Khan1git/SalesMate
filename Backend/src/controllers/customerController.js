import CustomerModel from "../models/customerModel.js";


export const createCustomer = async(req, res)=>{
    try {
        const {name, email, Address, phone,  AccountBalance } = req.body
        const addCustomer = new CustomerModel({
            name: name,
            email: email,
            Address: Address,
            phone: phone,
            AccountBalance: AccountBalance
        })
        const result = await addCustomer.save()
        res.status(201).json({ success: true, user: result });
    } catch (error) {
        console.error('Error Adding customer:', error.message);
        console.log(error)
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
} 

export const getAllCustomers = async (req, res) => {
    try {
        const getAll = await CustomerModel.find();

        res.status(200).json(getAll);
    } catch (error) {
        console.error('Error retrieving customers:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

export const getAllCustomersNumber = async(req, res) =>{
    try {
        const count = await CustomerModel.countDocuments()
        res.status(200).json(count)
    } catch (error) {
        console.log(error)
    }
}

// ---------------------- DELETE CUSTOMER BY ID ------------

export const deleteCustomerById = async (req, res) => {
    try {
        const id = req.params.id;
        const deleteCustomer = await CustomerModel.findByIdAndDelete(id);
        if (!deleteCustomer) {
            return res.status(404).json({ message: 'Customer not found' });
        }
        res.status(200).json(deleteCustomer);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

// -------- THE UPDATING CUSTOMER BY ID -----------------------------

export const updateById = async(req, res)=>{
    try {
        const response = await CustomerModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

