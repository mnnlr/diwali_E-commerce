import User from "../models/user.js";
import UserInfo from "../models/userInfo.js";

const savewishlist = async (req, res) => {
  if (req.method === "PUT") {
  try {
   
    const { userId, title, price, image, sale, rating } = req.body;
    // console.log('this is a req.body id-->', all)

    if (!userId || !title || !price || !image || !sale || !rating) {
      return res.status(400).send({ error: "All fields are required" });
    }

    const user = await User.findById(userId);
    // console.log("this is a user-->", user);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    try {
      if (!user.wishList) {
        user.wishList = [];
      }

     await UserInfo.updateOne(
        { userId },
        {
          $push: {
            wishList: {
              title,
              price,
              image,
              sale: Boolean(sale),
              rating: +rating,
            },
          },
        }
      );
      // console.log("this is updateWishList--->", updatedUser);
    } catch (err) {
      // console.log("getting error when push the data-->", err);
      return res.status(500).send({ error: "Failed to update wishlist" });
    }
    res
      .status(200)
      .json({
        message: "Watchlist updated successfully",
        wishList: user.wishList,
      });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}else if (req.method === 'GET') {
  try {
    const userId = req.query.userId;
    // console.log(userId) // assuming you're passing the userId as a query parameter
    const userInfo = await UserInfo.findOne({ userId });
    if (!userInfo) {
      return res.status(404).send({ error: "User not found" });
    }
    const wishlist = userInfo.wishList;
    res.status(200).json({ wishlist });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
} else {
  res.status(405).send("Method Not Allowed");
}

};

export { savewishlist };
