import Order from "../models/order.js";

const saveOrderDetails = async (req, res) => {
    const { products, total, totalItems, customerDetails } = req.body;
  
    const newOrder = new Order({
      products,
      total,
      totalItems,
      customerDetails,
    });
  
    try {
      await newOrder.save();
      res.status(201).send({ message: "Order saved successfully" });
    } catch (error) {
      res.status(500).send({ error: "Failed to save order" });
    }
  };

  export default saveOrderDetails;