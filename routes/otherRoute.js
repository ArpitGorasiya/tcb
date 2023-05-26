import express from 'express'

import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js'
import { contact, courseRequest, getDashboardStats } from '../controllers/otherController.js'

const router = express.Router()

router.post('/contact', contact)
router.post('/courserequest', courseRequest)
router.get('/admin/stats', isAuthenticated, authorizeAdmin, getDashboardStats)

export default router