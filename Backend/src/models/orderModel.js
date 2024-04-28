import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    name: String,
    price: Number,
    quantity: Number,
    discount: {
        type: Number,
        default: 0
    }
});

const invoiceSchema = new mongoose.Schema({
    customer: {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        name: String,
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
}, { timestamps: true });

const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
export default InvoiceModel
