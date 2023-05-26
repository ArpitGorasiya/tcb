import express from "express"
import course from './routes/courseRoute.js'
import user from './routes/userRoute.js'
import payment from './routes/paymentRoute.js'
import other from './routes/otherRoute.js'
import ErrorMiddleware from './middlewares/Error.js'
import cookieParser from 'cookie-parser'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))

app.use('/api/course', course)
app.use('/api/user', user)
app.use('/api/payment', payment)
app.use('/api/other', other)

app.get("/", (req, res) => {
    res.json("Server is Running")
})

export default app

app.use(ErrorMiddleware)