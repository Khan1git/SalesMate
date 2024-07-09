import mongoose from "mongoose";
import AutoIncrementFactory from 'mongoose-sequence';



const AutoIncrement = AutoIncrementFactory(mongoose);

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    discount: {
        type: Number,
        default: 0
    },
    unit: String
});


const tempOrderSchema = new mongoose.Schema({
    InvNo: {
        type: Number,
        unique: true
    },
    customer: {
        type: String
    },
    products: [productSchema],
    paid: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true })

tempOrderSchema.plugin(AutoIncrement, { inc_field: 'InvNo' });


const tempInvoice = mongoose.model('tempInvoice', tempOrderSchema)
export default tempInvoice