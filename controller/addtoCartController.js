import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";

const addtocartController = async (req, res) => {
    if (req.method === "PUT") {

  try {
    const {userId, title, price, image, sale, rating, id } = req.body;
    const all = req.body;
    console.log('this is a req.body id-->', all)

    if (!userId || !title || !price || !image || !sale || !rating ) {
      console.log('error', all)
      return res.status(400).send({ error: 'All fields are required' });
    }

    // console.log('this is data')
    const user = await User.findById(userId);
    // console.log('this is a user-->', user)
    if (!user) {
      return res.status(404).send({ error: 'User not found' }); 
    }

    try{
      if (!user.cart) {
        user.cart = [];
        }
      // user.wishList.push({title, price, image, sale, rating: +rating });
  
    await UserInfo.updateOne({userId}, {$push: {cart: {_id: id, title, price, image, sale: Boolean(sale), rating: +rating }}});
    //   console.log('this is updateWishList--->', updatedUser);
    }catch(err){
      console.log('getting error when push the data-->', err)
      return res.status(500).send({ error: 'Failed to update wishlist' });
    }
    // console.log({ title, price, image, sale, rating })

    res.status(200).json({ message: 'Watchlist updated successfully', wishList: user.wishList });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} else if (req.method === 'GET') {
    try {
      const userId = req.query.userId;
      // console.log('this is user', userId) // assuming you're passing the userId as a query parameter
      const userInfo = await UserInfo.findOne({ userId });
      if (!userInfo) {
        return res.status(404).send({ error: "User not found" });
      }
      const cart = userInfo.cart;
      res.status(200).json({ cart });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }else if (req.method === 'DELETE') {

      try {
          const { userId, itemId } = req.body;

          if (!userId || !itemId) {
              return res.status(400).send({ error: 'User ID and item ID are required' });
          }

          const userInfo = await UserInfo.findOne({ userId });
          if (!userInfo) {
              return res.status(404).send({ error: "User not found" });
          }

          const itemIndex = userInfo.cart.findIndex(item => item._id === itemId);
          if (itemIndex === -1) {
              return res.status(404).send({ error: "Item not found in cart" });
          }

          userInfo.cart.splice(itemIndex, 1);
          await userInfo.save();

          res.status(200).json({ message: 'Item removed from cart successfully', cart: userInfo.cart });
      } catch (err) {
          res.status(500).json({ error: err.message });
      }
  } else {
    res.status(405).send("Method Not Allowed");
  }
};

export { addtocartController };