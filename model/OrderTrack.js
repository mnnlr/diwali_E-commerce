import mongoose from 'mongoose'

const Schema = new mongoose.Schema({
    seller : {
        type : 'String',
        required: true
    },
    buyer : {
        type : 'String',
        required: true 
    },
    items : {
        type : Array,
        required: true 
    },
    orderPlaced : {
        type : Boolean,
        default : false
},
orderPacked : {
    type : Boolean,
    default : false
},
orderOnWay : {
    type : Boolean,
    default : false
},
orderDelivered : {
    type : Boolean,
    default : false
}
})
const Order = mongoose.model('OrderTrack', Schema)

export default Order