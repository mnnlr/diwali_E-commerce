import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    products: Array,
    total: Number,
    totalItems: Number,
    customerDetails: {
      firstname: String,
      lastname: String,
      country: String,
      address: String,
      city: String,
      state: String,
      zip: String,
      phone: String,
      email: String
    }
})


const Order = mongoose.model("orderDetails", orderSchema)

export default Order;