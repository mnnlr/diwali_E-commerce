import mongoose from 'mongoose';

const orderSchema = mongoose.Schema({
    
    amount_total: {
        type:Number,
        // required:true
    },
    
    amount_subtotal:{
        type:Number,
        // required:true
    },
    
    OrderedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    
    payment_session_id: {
        type: String,
        // required: true
    },
    
    products:[{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required:true
    }],

    recepientDetails:{
        name:String,
        email:String,
        phone:Number,
        address:String,
        city:String,
        state:String,
        country:String,
        postalCode:Number
    },
    orderStatus:{
        type:String,
        enum:["pending","completed","cancelled","shipped","delivered","returned"],
        default:"pending"
    },
    payedBy:{
        email:String,
        phone:Number,
        name:String,
    },                                                                                                                                                                                              
    paymentStatus:{
        type:String,
        enum:["pending","completed","failed"],
        default:"pending"
    },
    paymentMethod:{
        type:String,
        enum:["card","cash","upi"],
        default:"card"
    },
    paymentToken:String,
    paymentMode:String,
    currency:String,
    paymentTime:Date,
    deliveryTime:Date,

})


const Order = mongoose.model("order", orderSchema)

export default Order;