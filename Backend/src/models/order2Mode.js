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
    No: {
        type: Number,
        unique: true,
        // required: true
    },
    customer: {
        type: String,
        required: true
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


invoiceSchema.plugin(AutoIncrement, { inc_field: 'No' });


const tempInvoiceModel = mongoose.model('tempInvoice', invoiceSchema);
export default tempInvoiceModel
