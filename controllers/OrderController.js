import Cart from '../model/CartModel.js';
import Order from '../model/Order.js';
import UserInfo from '../model/UserInfo.js';
import Stripe from "stripe";

const svaeOrderDetails = async (req,res) => {
    
    try {
    const {userId} = req.user;

    const {recepientDetails } = req.body;
    console.log('req.body : ',req.body)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
        // console.log('stripe : ',stripe)

    // const userInfo = await UserInfo.findOne({ userId });

    const CartDetails = await Cart.findOne({ userId }).populate('products.productId');

    const lineItems = CartDetails?.products?.map((product) => ({
      price_data: {
        currency: "inr",
        product_data: {
          name: product?.productId?.name,
        }, 
        unit_amount: product?.productId?.price*100,
      },
        quantity: product?.quantity,
      }));

      console.log('lineItems : ',lineItems)
    
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card", "upi"],
        line_items: lineItems,
        mode: "payment",
        success_url: "http://localhost:3000/success",
        cancel_url: "http://localhost:3000/cancel",
    });
    
    console.log('checkout session : ',session?.id)

    const foundOrder = await Order.findOne({ OrderedBy: userId });

    if(foundOrder?._id){
      const updatedOrder = await Order.findByIdAndUpdate(foundOrder._id, { 
        OrderedBy:userId,
        products:CartDetails.products.map(product => product.productId),
        recepientDetails
      });
        console.log('updatedOrder : ',updatedOrder)
        return res.status(200).json({success:true,Data:{id:session?.id}});
    }

    const newOrder = new Order({
      products:CartDetails.products.map(product => product.productId),
      // payment_session_id: session.id,
      OrderedBy: userId,
      recepientDetails
    });

    const savedOrder = await newOrder.save();
    console.log('savedOrder : ',savedOrder)
    return res.status(200).json({success:true,Data:{id:session?.id}});

  } catch (error) {
    console.error('Failed to save order:', error);
    res.status(500).json({ message: 'Failed to save order', error });
  }
};

const paymentDetails = async(req,res,next) => {

  try {
    
    const {userId} = req.user;
    const {sessionId,recepientDetails} = req.body;

    console.log('userId : ',req.user);
    console.log('req body : ',req.body);

    const foundOrder = await Order.findOne({ purchesedBy: userId });
    console.log('foundOrder : ',foundOrder)

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    if(foundOrder?._id){
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      console.log('session : ',session)
      if(!session?.id) return next(new ErrorHandler(500,'payment unsucessful , please try again'));

      console.log('I am here...')
        const paymentDetails = await Order.findByIdAndUpdate(foundOrder._id, {
          amount_total: session.amount_total,
          amount_subtotal: session.amount_subtotal,
          // OrderedBy:userId,
          payment_session_id: session.id,
          recepientDetails:recepientDetails?recepientDetails:foundOrder.recepientDetails,
          payedBy:{
            email:session.customer_details?.email,
            name:session.customer_details?.name,
            phone:session.customer_details?.phone
          },
          paymentStatus:session.payment_status,
          paymentMethod: session.payment_method_types[0],
          paymentToken: session.payment_intent,
          paymentMode: session.mode,
          currency: session.currency,
        });

        console.log('paymentDetails : ', paymentDetails)
        return res.status(200).json({success:true,Data:`payment success`});
    }


  } catch (error) {
    next(error)
  }
}
  
export { svaeOrderDetails, paymentDetails };