import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true,  
    },
    balance: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    amount: {
        type: Number,
        required: true,  // Assuming amount should be required
    },
    method: {
        type: String,
        required: true,
        enum: ['Cash', 'Cheque', 'Demand Draft', 'Bank Transfer'],
    },
}, { timestamps: true });

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
