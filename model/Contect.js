import mongoose from 'mongoose';

const Schema = new mongoose.Schema({
    name : {
        type : String
    },
    email: {
        type : String
    },
    phone : {
        type : Number
    },
    message : {
        type : String
    }
});

const ContactModel = mongoose.model('Contact', Schema);

export default ContactModel;