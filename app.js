// using express
const express = require("express")
const cors = require('cors')
const app = express()
app.use(cors())
app.use(express.json())


// link mongoose
const mongoose = require('mongoose');
mongoose.set('strictQuery', true);
mongoose.connect('mongodb+srv://techjanet:mo01094323975@cluster0.hcjvtyu.mongodb.net/tech-cup');
// mongodb+srv://techjanet:mo01094323975@cluster0.hcjvtyu.mongodb.net/tech-cup
// mongodb://localhost:27017/tech-cup


// link nodemailer
const nodemailer = require('nodemailer');
// Send Email
const sendEmail = async () => {
    let testAccount = await nodemailer.createTestAccount();

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        service: 'gmail',
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'osamaatta058@gmail.com', // generated ethereal user
            pass: 'rfrzgefwwibeatij', // generated ethereal password
        },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
        from: 'osamaatta058@gmail.com', // sender address
        to: 'techjanet1@gmail.com', // list of receivers
        subject: "techjanet", // Subject line
        text: "techjanet", // plain text body
        html: `Someone made an order check out the dashboard` // html body
    })
}


// =====================================================================================================

// product Schema
const productSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    product_price: {
        type: Number,
        required: true
    },
    product_price_offer: Number,
    type: String,
    description: String,
    available: {
        type: Boolean,
        default: true
    },
    product_images: {
        mainPicURL: {
            type: String,
            default: 'not found'
        },
        PicURL1:  {
            type: String,
            default: 'not found'
        },
        PicURL2:  {
            type: String,
            default: 'not found'
        },
        PicURL3:  {
            type: String,
            default: 'not found'
        },
    },
})
const productModel = mongoose.model("product", productSchema)

// product API
app.post("/addProduct", async (req, res) => {
    try {
        const { product_name, product_price, product_price_offer, type, description, mainPicURL, PicURL1, PicURL2, PicURL3 } = req.body
        const product = await productModel.insertMany({ product_name, product_price, product_price_offer, type, description, product_images: { mainPicURL, PicURL1, PicURL2, PicURL3 } })
        res.json({ message: 'added', product })
    } catch (error) {
        res.json({ message: error })
    }
})

app.patch("/updateProduct/:id", async (req, res) => {
    try {
        const { id } = req.params
        const { product_name, product_price, product_price_offer, type, description, available, mainPicURL, PicURL1, PicURL2, PicURL3 } = req.body
        await productModel.findByIdAndUpdate(id, { product_name, product_price, product_price_offer, type, description, available, product_images: { mainPicURL, PicURL1, PicURL2, PicURL3 } }, { new: true })
        res.json({ message: 'updated' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.delete("/deleteProduct/:id", async (req, res) => {
    try {
        const { id } = req.params
        await productModel.findOneAndDelete({ _id: id })
        res.json({ message: 'deleted' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getAllProducts", async (req, res) => {
    try {
        const products = await productModel.find({})
        res.json({ message: 'done', products })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getDetails/:id", async (req, res) => {
    try {
        const { id } = req.params
        const productData = await productModel.findOne({ _id: id })
        res.json({ message: 'done', productData })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getDetailsByType/:type", async (req, res) => {
    try {
        const { type } = req.params
        const products = await productModel.find({ type })
        res.json({ message: 'done', products })
    } catch (error) {
        res.json({ message: error })
    }
})

// =====================================================================================================

// order Schema
const orderSchema = new mongoose.Schema({
    product_name: {
        type: String,
        required: true
    },
    full_name: {
        type: String,
        required: true
    },
    phone_number: {
        type: String,
        required: true
    },
    another_phone_number: String,
    city: String,
    address: String,
    quantity: Number,
    date_of_order: String,
    delivery: {
        type: Boolean,
        default: false
    },
})
const orderModel = mongoose.model("order", orderSchema)

app.post("/addOrder", async (req, res) => {
    try {
        const { product_name, full_name, phone_number, another_phone_number, city, address, quantity } = req.body
        await orderModel.insertMany({ product_name, full_name, phone_number, another_phone_number, city, address, quantity, date_of_order: new Date() })
        sendEmail()
        res.json({ message: 'added' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.delete("/deleteOrder/:id", async (req, res) => {
    try {
        const { id } = req.params
        await orderModel.findOneAndDelete({ _id: id })
        res.json({ message: 'deleted' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.patch("/updateOrderDelivery/:id", async (req, res) => {
    try {
        const { id } = req.params
        await orderModel.findByIdAndUpdate(id, { delivery: true }, { new: true })
        res.json({ message: 'updated' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getAllOrders", async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.json({ message: 'done', orders })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getOrdersDetails/:id", async (req, res) => {
    try {
        const { id } = req.params
        const orderData = await orderModel.findOne({ _id: id })
        res.json({ message: 'done', orderData })
    } catch (error) {
        res.json({ message: error })
    }
})

//=============================================================================================================

// shipping Schema
const ShippingSchema = new mongoose.Schema({
    city_name: String,
    shipping_price: Number
})
const shippingModel = mongoose.model("shipping", ShippingSchema)

app.post("/addShipping", async (req, res) => {
    try {
        const { city_name, shipping_price } = req.body
        await shippingModel.insertMany({ city_name, shipping_price })
        res.json({ message: 'added' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getDetailsShippingByType/:type", async (req, res) => {
    try {
        const { type } = req.params
        const shipping = await shippingModel.find({ city_name: type })
        res.json({ message: 'done', shipping })
    } catch (error) {
        res.json({ message: error })
    }
})

//=============================================================================================================

// visitor Schema
const visitorsSchema = new mongoose.Schema({
    number_of_visitors: Number
})
const visitorsModel = mongoose.model("visitor", visitorsSchema)

app.post("/addVisitor", async (req, res) => {
    try {
        const { number_of_visitors } = req.body
        await visitorsModel.insertMany({ number_of_visitors })
        res.json({ message: 'added' })
    } catch (error) {
        res.json({ message: error })
    }
})

app.patch("/updateVisitor/:id", async (req, res) => {
    try {
        const { id } = req.params
        const visitor = await visitorsModel.find({ _id: id })
        const newVisitor = visitor[0].number_of_visitors + 1
        const visitorNumber = await visitorsModel.findByIdAndUpdate(id, { number_of_visitors: newVisitor }, { new: true })
        res.json({ message: 'done', visitorNumber })
    } catch (error) {
        res.json({ message: error })
    }
})

app.get("/getAllVisitor", async (req, res) => {
    try {
        const visitor = await visitorsModel.find({})
        res.json({ message: 'done', visitor })
    } catch (error) {
        res.json({ message: error })
    }
})

app.listen(3000)