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
app.use(cors(credentials = true))

app.use('/api/v1', course)
app.use('/api/v1', user)
app.use('/api/v1', payment)
app.use('/api/v1', other)

app.get("/", (req, res) => {
    res.json("Server is Running")
})

export default app

app.use(ErrorMiddleware)
