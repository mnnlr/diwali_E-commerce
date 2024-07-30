import mongoose from 'mongoose';

const CartSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    },
    products: [{
        productId: {
            type: mongoose.Schema.ObjectId,
            ref: 'Product'
        },
        quantity: {
            type: Number,
            min:0,
            default: 1
        }
    }]
}, 
{
    timestamps: true

});

const Cart = mongoose.model('Cart', CartSchema);

export default Cart;
