import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true
    },
    category: {
        type: String,
        default: "others"
    },
    quantity: {
        type: Number,
        required: true
    },
    saleprice: {
        type: Number,
        required: true
    },
    purchasePrice: {
        type: Number,
        required: true
    }


}, {timestamps: true})

const ProductModel = mongoose.model("product", ProductSchema)
export default ProductModel