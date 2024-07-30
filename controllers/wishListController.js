import Wishlist from "../model/wishListModel.js";

const getWishLists = async(req, res)=> {
    try {
        const { userId } = req.user;
        const caetData = await Wishlist.findOne({userId}).populate('products.productId');
        if (!caetData) {
          return res.status(404).json({ error: 'User not found' });
        }
        return res.json({success:true,Data:caetData});
      } catch (err) {
        return res.status(500).json({ error: 'Internal server error' });
      }
}

const addToWishList = async(req, res)=>{
    try{
        const { id } = req.query;
        const {userId} = req.user;
        
        if (!id) {
            return res.status(400).json({success:false, message:'id is required' });
        }

        const wishlist = await Wishlist.findOne({userId});
        
        if (!wishlist?._id) {
            await Wishlist.create({
                 userId,
                 products: {
                     productId: id,
                     // quantity: req.body.quantity
                 }
             });
            
            return res.status(200).json({ message: 'added to wishlist',success:true });
         }
         
        const foundProductInWishlist = await wishlist.products.find(product => product.productId.toString() === id);
        
         if (foundProductInWishlist) {
            return res.status(400).json({success:false, message:'already in wishlist' });
        }

        const ggg = await Wishlist.updateOne({userId}, { $push: { products: {
            productId: id,
        } } });

        return res.status(200).json({ message: 'added to wishlist',success:true });
       
    }catch(err){
        return res.send(err)
    }
}

const removeFromWishList = async(req, res)=>{
    try{

        const { userId } = req.user;
        const { productId } = req.query;

        if (!productId) {
            return res.status(400).json({ success:false,message:'Product ID are required' });
        }

        await Wishlist.findOneAndUpdate({ userId }, { $pull: { products: { productId: productId } } }, { new: true });
        return res.status(200).json({success:true,message: 'removed from wishlist'});

    }catch(err){
        console.log('err : ',err)
        return res.status(500).send({ error: err.message });
    }
}


export {getWishLists,addToWishList,removeFromWishList}