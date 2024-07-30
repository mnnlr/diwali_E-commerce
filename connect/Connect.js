import mongoose from 'mongoose';


const db = async () => {
    try{
        if(!process.env.MONGO_URL){
            console.log('No URL')
            return ('No URL')
        //    throw Error('NO URL');
        }
        mongoose.connect(process.env.MONGO_URL);
        console.log('database Connected')
    }catch (error){
         console.log('Error when data base connection', error)
    }
}

export default db;