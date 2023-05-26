import app from './app.js'
import mongoose from 'mongoose'
import dv from 'dotenv'
import cloudinary from 'cloudinary'
import Razorpay from 'razorpay'
import nodeCron from 'node-cron'
import { Stats } from './models/Stats.js'

dv.config()

const url = process.env.MONGO_URI
mongoose.connect(url).then(console.log('Database Connected'))

const port = process.env.PORT
app.listen(port, () => {
    console.log(`Server is Running on http://localhost:${port}`)
})

cloudinary.v2.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET
})

export const instance = new Razorpay({
    key_id: process.env.RAZORPAY_API_KEY,
    key_secret: process.env.RAZORPAY_API_SECRET,
});

nodeCron.schedule("0 0 0 1 * *", async () => {
    try {
        await Stats.create({})
    } catch (error) {
        console.log(error)
    }
})