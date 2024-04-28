import mongoose from 'mongoose'
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    customerName: {
        type: String
    },
    customer: {
        type: mongoose.Schema.type.ObjectId,
        ref: 'customerModel'
    },
    products: [{
        type: mongoose.Schema.type.ObjectId,
        ref: 'product',
        required: true
    }],
    quantity: [{
        type: Number,
        required: true
    }],
    totalAmount: {
        type: Number,
        required: true
    },
});

const OrderModel = mongoose.model('Invoice', orderSchema);
export default OrderModel
