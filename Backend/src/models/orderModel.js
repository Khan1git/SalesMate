import mongoose from 'mongoose';
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


const invoiceSchema = new mongoose.Schema({
    InvoiceNo: {
        type: Number,
        unique: true,
        // required: true
    },
    customer: {
        customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer' },
        name: String,
        // RemainingBalance: Number,
    },
    products: [productSchema],
    paid: {
        type: Boolean,
        default: false
    },
    payment: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
}, { timestamps: true });


invoiceSchema.plugin(AutoIncrement, { inc_field: 'InvoiceNo' });


const InvoiceModel = mongoose.model('Invoice', invoiceSchema);
export default InvoiceModel
