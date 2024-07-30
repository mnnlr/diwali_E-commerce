import {config} from 'dotenv'
config({ path:'./config/.env.config'});
import express from 'express'
import cookieParse from "cookie-parser";
import cors from 'cors'

const app = express()

import { v2 as cloudinary } from 'cloudinary';
import streamifier from 'streamifier'
import Stripe from 'stripe'
import multer from 'multer'
import path from 'path'
import { body, validationResult } from 'express-validator';
import morgan from 'morgan';

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

//------------------------------------------unused imports------------------------------------------------
// const fs = require('fs');
// const firebase = require('firebase/app')
// const { v4: uuidv4 } = require('uuid');
// const { initializeApp } = require('firebase/app');
// const { getStorage, ref, uploadBytesResumable, getDownloadURL, listAll,uploadBytes } =require('@firebase/storage');
//---------------------------------------------------------------------------------------------------------


import connectDB from './connect/Connect.js'
import './connect/Imageconfig.js'

app.use(cors({
  origin:['https://diwali-e-commerce-backend-n2a2.onrender.com','http://localhost:3000', process.env.CLIENT_URL],
  credentials:true,
  methods:['GET','POST','PUT','DELETE']

}))

app.use(cookieParse(process.env.COOKIE_SECRET));
app.use(express.json());
app.use(morgan('dev'));

//-------------------------------------------Multer Config--------------------------------------------------
const upload = multer({storage : multer.memoryStorage()});
//---------------------------------------------------------------------------------------------------------

//-------------------------------------------importing Routes----------------------------------------------

import registerRoute from './routes/registerRoute.js'
import loginRoute from './routes/loginRoute.js'
import RefreshTokenRoute from './routes/RefreshTokenRoute.js'
import wishListRoute from './routes/watchlist.js'
import cartRoute from './routes/cartRoute.js'
import clothingRouter from './routes/clothingRoute.js'
import paymentRoute from './routes/PaymentRoute.js'
import orderRoute from './routes/orderRoute.js'
import { ErrorMiddleware } from './middleware/ErrorMiddleware.js';

//---------------------------------------------------------------------------------------------------------

//-------------------------------------------Using Routes--------------------------------------------------
app.use('/register', registerRoute )
app.use('/login', loginRoute )
app.use('/refresh-token', RefreshTokenRoute )
app.use('/cart', cartRoute )
app.use('/wishlist', wishListRoute)
app.use('/clothing', clothingRouter)
app.use('/payment', paymentRoute)
app.use('/order', orderRoute)
//---------------------------------------------------------------------------------------------------------


//-------------------------------------------Models--------------------------------------------------------
// model
import Bill from './model/Bill.js'
import GirlModel from './model/Girl.js'
import MenModel from './model/Men.js'
import OtherModel from './model/Other.js'
import ContactModel from './model/Contect.js';
import Category from './model/CategoryModel.js';
import Products from './model/ProductsModel.js';
//---------------------------------------------------------------------------------------------------------


app.post('/',async(req,res)=>{
  try {
    const category = await Category.create({
      name: "Kurta",
    });
    return res.status(200).send(category);
  } catch (error) {
    console.error('Error creating category:', error);
  }
})

app.post('/product', async (req, res) => {

  try {
    const category = await Category.find({ name: {$in:["Ethnic", "Kids" , "Girl" , "Clothing", "Sets","Ethnic Sets"]} });
    
    // Men Cotton Blend Kurta Pyjama Set
    girlsEthnicWear.forEach(async(product)=>{
    //replace image 128/128 with 1080/1080 for better quality
    const newImage = product.images.map((image)=>image.replace('128/128','1080/1080'))
    await Products.create({
      name:product.name,
      description:product.description,
      price:product.price,
      images:newImage,
      categoryIds:category.map((cat)=>cat._id),
      attributes:product.attributes,
      stockQuantity:product.stockQuantity,
    })
  }
)

console.log('Data length : ',girlsEthnicWear.length)
    // const products = await Products.find({});   
    return res.status(200).send(girlsEthnicWear);
  } catch (error) {
    console.error('Error fetching products:', error);
    return res.status(500).send('Server Error');
  }
});

app.get('/ggg', async (req, res) => {
  try {

    const category = ["Ethnic", "Kids" , "Clothing", "Sets","Ethnic Sets"];
    //find product by category
    const products = await Products.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'categoryIds',
          foreignField: '_id',
          as: 'categories'
        }
      },
      {
        $addFields: {
          categoryNames: { $map: { input: "$categories", as: "category", in: "$$category.name" } }
        }
      },
      {
        $match: {
          $expr: {
            $setIsSubset: [category, "$categoryNames"]
          }
        }
      },
      {
        $project: {
          _id: 1,
          name: 1,
          description: 1,
          price: 1,
          images: 1,
          stockQuantity: 1,
          createdAt: 1,
          updatedAt: 1,
          categoryIds: 1,
          attributes:1
        }
      }
    ]).exec();

    // find Category by name

    const categoryData = await Category.findOne({ name: "Boy" });

    console.log('categoryData : ',categoryData)
    let count = 0;
    
    // for (let product of products) {
    //   const fp = boysEthnicWear.find(p => p.name === product.name);
    //   if (fp) {
    //     count++;
    //     console.log('Product:', product._id, count);
    //     await Products.findByIdAndUpdate(
    //       product._id,
    //       { $push: { categoryIds: categoryData._id } },
    //       { new: true, useFindAndModify: false }
    //     );
    //   }
    // }

    return res.status(200).send(products);

  } catch (error) {

    console.error('Error fetching products:', error);

    return res.status(500).send('Server Error');

  }});
app.post('/bills', [
  body('firstName').notEmpty().withMessage('First name is required'),
    body('lastName').notEmpty().withMessage('Last name is required'),
    body('country').notEmpty().withMessage('Country is required'),
    body('address').notEmpty().withMessage('Address is required'),
    body('city').notEmpty().withMessage('City is required'),
    body('state').notEmpty().withMessage('State is required'),
    body('zip').isNumeric().withMessage('Zip code must be a number'),
    body('phone').matches(/^\d{10}$/).withMessage('Phone number must be exactly 10 digits and numeric'),
    body('email').isEmail().withMessage('Email must be valid')
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
  }

  const { firstName, lastName, country, address, city, state, zip, phone, email, total } = req.body;

  try {
      const newBill = new Bill({ firstName, lastName, country, address, city, state, zip, phone, email });
      await newBill.save();
      const paymentIntent = await stripe.paymentIntents.create({
        amount: amount, 
        currency: 'usd',
        payment_method_types: ['card'],
    });

    res.status(200).send({
        clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
      res.status(500).json({ message: 'Error creating bill', error: error.message });
  }
});

app.put('/update', async (req, res) => {
  const { seller, id } = req.body;

  try {
    const data = await GirlModel.findById(id);

    if (!data) {
      return res.status(404).send({ error: 'User not found' });
    }
if(!data.seller){
  data.seller = seller;

    await data.save();

    res.send(data);
}
   
  } catch (err) {
    console.error(err);
    res.status(500).send({ error: 'Internal server error' });
  }
});

app.post('/contact', async(req,res)=>{
  const {name, email, phone, message} = req.body
  try{
const data = new ContactModel({name, email, phone, message})
const respon = await data.save()
res.send(respon)
  }catch(err){
      res.send(err)
  }
})


app.post('/girl', upload.single('image'), async (req, res) => {
  try {
    console.log('Request received:', req.body);

    const { title, price, q, seller } = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      console.log('No image uploaded.');
      return res.status(400).send('No image uploaded.');
    }

    console.log('Image file:', imageFile);

    console.log('Uploading to Cloudinary...');

    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'your_folder_name' },
      async (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        console.log('Image uploaded to Cloudinary:', result);

        // Store the image URL and other data in MongoDB
        const newImage = new GirlModel({
          title,
          price,
          image: result.secure_url,
          q,
          seller
        });

        await newImage.save();

        return res.json({ message: 'Image uploaded and data saved successfully', data: newImage });
      }
    );

    // streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: 'An error occurred' });
  }
});

app.post('/men', upload.single('image'), async (req, res) => {
  try {
    console.log('Request received:', req.body);

    const { title, price, q, seller} = req.body;
    const imageFile = req.file;

    if (!imageFile) {
      console.log('No image uploaded.');
      return res.status(400).send('No image uploaded.');
    }

    console.log('Image file:', imageFile);

    console.log('Uploading to Cloudinary...');

    // Upload the image to Cloudinary
    const uploadStream = cloudinary.uploader.upload_stream(
      { resource_type: 'image', folder: 'your_folder_name' },
      async (error, result) => {
        if (error) {
          console.error('Error uploading to Cloudinary:', error);
          return res.status(500).json({ error: 'Failed to upload image' });
        }

        console.log('Image uploaded to Cloudinary:', result);

        // Store the image URL and other data in MongoDB
        const newImage = new MenModel({
          title,
          price,
          image: result.secure_url,
          q,
          seller
        });

        await newImage.save();

        return res.json({ message: 'Image uploaded and data saved successfully', data: newImage });
      }
    );

    streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ error: 'An error occurred' });
  }
});



app.post('/others', upload.single('image'), async (req, res) => {
    try {
      console.log('Request received:', req.body);
  
      const { title, price, q, seller } = req.body;
      const imageFile = req.file;
  
      if (!imageFile) {
        console.log('No image uploaded.');
        return res.status(400).send('No image uploaded.');
      }
  
      console.log('Image file:', imageFile);
  
      console.log('Uploading to Cloudinary...');
  
      // Upload the image to Cloudinary
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'image', folder: 'your_folder_name' },
        async (error, result) => {
          if (error) {
            console.error('Error uploading to Cloudinary:', error);
            return res.status(500).json({ error: 'Failed to upload image' });
          }
  
          console.log('Image uploaded to Cloudinary:', result);
  
          // Store the image URL and other data in MongoDB
          const newImage = new OtherModel({
            title,
            price,
            image: result.secure_url,
            q,
            seller
          });
  
          await newImage.save();
  
          return res.json({ message: 'Image uploaded and data saved successfully', data: newImage });
        }
      );
  
      streamifier.createReadStream(imageFile.buffer).pipe(uploadStream);
  
    } catch (error) {
      console.error('Error processing request:', error);
      res.status(500).json({ error: 'An error occurred' });
    }
});

app.post('/others-data', async (req, res) => {
  const {seller} = req.body
  try {
    const girlsData = await OtherModel.find({ seller });

    if (girlsData.length === 0) {
      return res.status(404).send({ error: 'No data found for this seller' });
    }

    res.send(girlsData);
  } catch (error) {
    console.error(error);
    return res.status(500).send('Server Error');
  }
});

app.post('/men-data', async (req, res) => {
  const { seller } = req.body;

try {
  const menData = await MenModel.find({ seller });

  if (!menData || menData.length === 0) {
    return res.status(404).json({ error: 'No data found for this seller' });
  }

  res.json(menData);
} catch (err) {
  console.error('Error fetching data:', err);
  return res.status(500).send('Server Error');
}
});

app.post('/girl-data', async(req,res)=>{
  const { seller } = req.body;
console.log(seller)
  try {
      const data = await GirlModel.find({ seller : seller });

      if (data.length === 0) {
          return res.status(401).send("No data");
      }
console.log(data)
return res.send(data);
  } catch (err) {
      console.error(err);
      return res.status(500).send("Server Error");
  }
})


const getImageData = async (imagePath) => {
  try {
    const imagePathAbs = path.join(__dirname, imagePath); 
    return imagePathAbs;
  } catch (error) {
    console.error('Error reading image file:', error);
    return null;
  }
};

app.use(ErrorMiddleware)
const PORT = process.env.PORT || 8000;

app.listen(PORT, async() => {
  await connectDB();
  console.log(`Example app listening on port ${PORT}`)
})