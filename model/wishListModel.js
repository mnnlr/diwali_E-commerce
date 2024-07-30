import mongoose from 'mongoose';

const WishListSchema = new mongoose.Schema({

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
        // quantity: {
        //     type: Number,
        //     min:0
        // }
    }]
}, 
{
    timestamps: true

});

const Wishlist = mongoose.model('wishlist', WishListSchema);

export default Wishlist;
