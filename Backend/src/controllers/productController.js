import ProductModel from "../models/productModel.js";

export const addProduct = async (req, res) => {
    try {
        const { productName, category, quantity, saleprice, purchasePrice, unit  } = req.body
        const doc = new ProductModel({
            productName,
            category,
            quantity,
            saleprice,
            purchasePrice,
            unit
        })
        const result = await doc.save()
        res.status(200).json(result)
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

// ---------- GET ALL PRODUCTS ------------------------

export const getAllProducts = async(req, res)=>{
    try {
        const show = await ProductModel.find()
        res.status(200).json(show)
    } catch (error) {
        console.log("Can't fetch all products", error)
    }
}

// -------------- COUNT ALL PRODUCTS ---------------

export const countProducts = async(req, res)=>{
    try {
        const result = await ProductModel.countDocuments()
        res.status(200).json(result)
    } catch (error) {
        console.log(error)
    }
}

// ------------------------- DELTEING BY ID ----------------------

export const deleteProduct = async(req, res) =>{
    try {
        const response = await ProductModel.findByIdAndDelete(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

// ---------------- setting up the update funtion ---------------------

export const updateProductById = async(req, res)=>{
    try {
        const response = await ProductModel.findByIdAndUpdate(req.params.id, req.body)
        res.status(200).json(response)
    } catch (error) {
        console.log(error)
    }
}

