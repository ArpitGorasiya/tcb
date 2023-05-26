import express from 'express'
import { isAuthenticated } from '../middlewares/auth.js'
import { buySubscription, cancelSubscription, getRazorPayKey, paymentVerification } from '../controllers/paymentController.js'


const router = express.Router()

router.get('/subscribe', isAuthenticated, buySubscription)
router.post('/paymentverification', isAuthenticated, paymentVerification)
router.get('/razorpaykey', getRazorPayKey)
router.delete('/subscribe/cancel', isAuthenticated, cancelSubscription)

export default router