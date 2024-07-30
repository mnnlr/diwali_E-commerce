import Cart from '../model/CartModel.js';

const getCart = async(req, res)=> {
    try {
        const { userId } = req.user;

        const caetData = await Cart.findOne({userId}).populate('products.productId');

        if (!caetData) {
          return res.status(404).json({success:false,message: 'User not found' });
        }
        
        return res.status(200).json({success:true,Data:caetData});
      
    } catch (err) {
        return res.status(500).json({success:false,message: 'Internal server error' });
      }
}

const addToCart = async(req, res)=>{
    try{
        const { id,quantity } = req.query;
        const {userId} = req.user;

        console.log('req query : ',req.query)
        console.log('req query : ',req.user)

        if (!id) {
            return res.status(400).json({success:false, message:'id is required' });
        }

        const cart = await Cart.findOne({userId});
        
        console.log('cart : ',cart)
        console.log('quantity : ',quantity)

        if (!cart?._id) {
            const ggg = await Cart.create({
                 userId,
                 products: {
                     productId: id
                 }
                });
                console.log('ggg : ',ggg)

                return res.status(200).json({ message: 'Item added to cart',success:true });
         }

         if(cart?._id){
            const foundProductInCart = await cart.products.find(product => product?.productId.toString() === id);
    
            if (foundProductInCart) {
                return res.status(400).json({success:false, message:'Product already exists in cart' });
            }

            const fff = await Cart.updateOne({userId}, { $push: { products: {
                            productId: id,
                            quantity: quantity
                    }}});
                    console.log('fff : ',fff)
                    return res.status(200).json({ message: 'Item added to cart',success:true });

        }
        

        // if(cart?._id){
        //     const fff = await Cart.updateOne({userId}, { $push: { products: {
        //             productId: id,
        //             quantity: quantity
        //     }}});
        //     console.log('fff : ',fff)
        //     return res.status(200).json({ message: 'Item added to cart',success:true });
        // }
       
    }catch(err){
        console.log('err : ',err)
        return res.status(500).json({success:false,message:err.message})
    }
}

const updateCart = async(req, res)=>{
    try {
        
        const { id,quantity } = req.query;
        const {userId} = req.user;

        console.log('req query : ',req.query)
        console.log('req query : ',req.user)

        if (!id) {
            return res.status(400).json({success:false, message:'id is required' });
        }

        const cart = await Cart.findOne({userId});


        if (!cart?._id) {
                return res.status(200).json({ message: 'cart not found',success:false });
         }

         const fff = await Cart.updateOne(
            { userId: userId, 'products.productId': id},
            { $set: { 'products.$.quantity': quantity } }
          );
        console.log('fff : ',fff)
        
        return res.status(200).json({ message: 'Item added to cart',success:true });

    } catch (error) {
        res.status(500).json({success:false,message: error.message });
        
    }
}
const removeFromCart = async(req, res)=>{
    try{

        const { userId } = req.user;
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ success:false,message:'Product ID are required' });
        }

        const deletedProduct = await Cart.findOneAndUpdate({ userId }, { $pull: { products: { productId: productId } } }, { new: true });

        console.log('deletedProduct : ',deletedProduct)

        res.status(200).json({success:true,message: 'item removed from cart'});

    }catch(err){
        console.log('err : ',err)
        res.status(500).json({success:false,message: err.message });
    }
}


export {addToCart,getCart,updateCart,removeFromCart}