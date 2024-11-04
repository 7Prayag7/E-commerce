const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
require('dotenv').config();

const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

app.use(express.json());
app.use(cors());// because of this react will be connected to backend on 4000 port

//databse connection with MongoDb
mongoose.connect("mongodb+srv://rastogiprayag:jJWsHonYNhja84ER@cluster0.0kt4q.mongodb.net/e-commerce")

//API creation

app.get("/", (req,res)=>{
    res.send("Express app is running");
})

// Cloudinary configuration
// cloudinary.config({
//     cloud_name: 'dvant1jjc', // replace with your Cloudinary cloud name
//     api_key: '636321273633736', // replace with your Cloudinary API key
//     api_secret: 'h2niipy-GN4vMjcvBljveSmhd1s' // replace with your Cloudinary API secret
// });

cloudinary.config({
    cloudinary_url: process.env.CLOUDINARY_URL
});

// Setup Cloudinary storage for multer
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'e-commerce', // Folder name in Cloudinary where images will be stored
        allowed_formats: ['jpeg', 'png', 'jpg']
    }
});

const upload = multer({ storage: storage });

// Endpoint for image upload
app.post("/upload", upload.single('product'), (req, res) => {
    res.json({
        success: 1,
        image_url: req.file.path // This will be the Cloudinary URL for the uploaded image
    });
});

//Image storage engine
// const storage = multer.diskStorage({
//     destination: './upload/images',
//     filename: (req, file, cb)=>{
//         return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
//     }
// })

// const upload = multer({storage: storage})

//creating upload endpoint for images
// app.use("/images", express.static('upload/images'))
// app.post("/upload", upload.single('product'), (req,res)=>{
//     res.json({
//         success: 1,
//         image_url: `http://localhost:${port}/images/${req.file.filename}`
//     })
// })

//schema for creating products
const Product = mongoose.model("Product", {
    id: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    category: {
        type: String,
        requireed: true
    },
    new_price: {
        type: Number,
        required: true
    },
    old_price : {
        type: Number,
        required: true
    },
    date: {
        type: Date,
        default: Date.now()
    },
    available: {
        type: Boolean,
        default: true
    }
});

app.post('/addproduct', async(req, res)=>{
    let products = await Product.find({});
    let id;
    if(products.length >0){
        let last_product_array = products.slice(-1);
        let last_product = last_product_array[0];
        id = last_product.id+1;
    }
    else{
        id=1;
    }
    const product = new Product({
        id: id,
        name: req.body.name,
        image: req.body.image,
        category: req.body.category,
        new_price: req.body.new_price,
        old_price: req.body.old_price,
    })
    console.log(product);
    await product.save();
    console.log("saved");
    res.json({
        success:true,
        name: req.body.name, 
    })
})

//api fpr removing deleting product
app.post('/removeproduct', async(req, res)=>{
    await Product.findOneAndDelete({id:req.body.id});
    console.log("removedd");
    res.json({
        success: true,
        name: req.body.name
    })
})

//api for getting all products
app.get('/allproducts', async(req, res)=>{
    let products = await Product.find({});
    console.log("allproduct fetched")
    res.send(products);
})

//user schema
const Users = mongoose.model('Users', {
    name: {
        type: String,
    },
    email: {
        type: String,
        unique: true,
    },
    password: {
        type: String,
    },
    cartData: {
        type: Object,
    },
    date: {
        type: Date,
        default: Date.now,
    }
})

//creating endpoint for registering the user
app.post('/signup', async(req, res)=>{
    let check = await Users.findOne({email: req.body.email});
    console.log(check);
    if(check){
        return res.status(400).json({success: false, errors: "existing users found with email id"})
    }

    let cart = {};
    for(let i=0; i<300; i++){
        cart[i]=0;
    }
    const user = new Users({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        cartData: cart
    })
    await user.save();
    const data = {
        user: {
            id: user.id
        }
    }
    const token = jwt.sign(data, 'secret_ecom')
    res.json({success: true, token})
})

//creating endpoint for user login
app.post('/login', async(req, res)=>{
    let user = await Users.findOne({email: req.body.email});
    if(user){
        const passCompare = req.body.password === user.password;
        if(passCompare){
            const data = {
                user: {
                    id: user.id
                }
            }
            const token = jwt.sign(data, 'secret_ecom')
            res.json({success: true, token})
        }
        else{
            res.json({success: false, errors: "wrong password"})
        }
    }
    else{
        res.json({success: false, errors: "user not found"})
    }
})

//creating endpoint for new collection data
app.get('/newcollections', async(req, res)=>{
    let products = await Product.find({});
    let newcollection = products.slice(1).slice(-8);
    console.log("new collections fetched");
    res.send(newcollection);
})

//creating endpoint for popular in women
app.get('/popularinwomen', async(req, res)=>{
    let products = await Product.find({category: "women"});
    let popular_in_women = products.slice(0,4);
    console.log("popular in women fetched");
    res.send(popular_in_women);
})

//creating middleware to fetch user
const fetchUser = async(req, res, next)=>{
    const token = req.header('auth-token');
    if(!token){
        res.status(401).send({errors: "please authenticate using valid token"})
    }
    else{
        try{
            const data = jwt.verify(token, 'secret_ecom');
            req.user = data.user;
            next(); 
        }
        catch(error){
            res.status(401).send({errors: "please authenticate using a valid token"});
        }
    }
}

//creating endpoint for adding producst in cartData
app.post('/addtocart', fetchUser, async(req,res)=>{
    console.log("added", req.body.ItemId);
    // console.log(req.body, req.user);
    let userData = await Users.findOne({_id: req.user.id});
    console.log(userData);
    // if (!userData.cartData[req.body.itemId]) {
    //     userData.cartData[req.body.itemId] = 0; // Initialize if not present
    // }
    userData.cartData[req.body.ItemId] +=1;
    console.log(userData.cartData[req.body.ItemId]);
    await Users.findOneAndUpdate(
        {_id: req.user.id}, 
        {cartData: userData.cartData}
    );
    // res.send("added");
    res.json("added");
})

//creating endpoint to remove product from cartData
app.post('/removefromcart', fetchUser,async(req, res)=>{
    console.log("removed", req.body.itemId);
    let userData = await Users.findOne({_id: req.user.id});
    if(userData.cartData[req.body.itemId]>0){
        userData.cartData[req.body.itemId] -=1;
    }
    await Users.findOneAndUpdate({_id: req.user.id}, {cartData: userData.cartData})
    res.send("removed");
})

//creating endpoint to get cardata
app.post('/getcart', fetchUser, async(req,res)=>{
    console.log("getcart");
    let userData = await Users.findOne({_id: req.user.id})
    res.json(userData.cartData);
})

app.listen(port, (error)=>{
    if(!error){
        console.log("Server running on " + port );
    }
    else{
        console.log("Error: " + error);
    }
});
//9:03:55 host starts explaining what function is doing what in last 6 minutes
//rastogiprayag mongoDb atlas username
//jJWsHonYNhja84ER mongoDb atlas pass
//8:39:39 product while adding in cart is not consoling
//just check the testing it did
