import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    images: [{
        type: String
    }],
    categoryIds: [{
        type: mongoose.Schema.ObjectId,
        ref: 'Category'
    }],
    attributes:mongoose.Schema.Types.Mixed,
    stockQuantity: Number,
  },{
    timestamps: true
  });


const Products = mongoose.model('Product', Schema);

export default Products;