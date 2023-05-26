import express from "express"
import course from './routes/courseRoute.js'
import user from './routes/userRoute.js'
import payment from './routes/paymentRoute.js'
import other from './routes/otherRoute.js'
import ErrorMiddleware from './middlewares/Error.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'

const app = express()

app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/api/v1', course)
app.use('/api/v1', user)
app.use('/api/v1', payment)
app.use('/api/v1', other)

app.get("/", (req, res) => {
    res.json("Server is Running")
    res.setHeader(" ", "*")
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Max-Age", "1800");
    res.setHeader("Access-Control-Allow-Headers", "content-type");
    res.setHeader("Access-Control-Allow-Methods", "PUT, POST, GET, DELETE, PATCH, OPTIONS");
})

export default app

app.use(ErrorMiddleware)