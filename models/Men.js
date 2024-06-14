import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    seller : {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'userInfo'
    },
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String
    },
    q: {
        type: Number,
        required: true
    }
});

const MenModel = mongoose.model('Men', Schema);

export {MenModel};