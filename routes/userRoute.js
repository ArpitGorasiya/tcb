import express from 'express'
import { addToPlayList, changePassword, deleteProfile, deleteUser, forgetPassword, getAllUsers, login, logout, profile, register, removeFromPlayList, resetPassword, updateProfile, updateProfilePicture, updateUserRole } from '../controllers/userController.js'
import { authorizeAdmin, isAuthenticated } from '../middlewares/auth.js'
import singleUpload from '../middlewares/multer.js'
import { getDashboardStats } from '../controllers/otherController.js'

const router = express.Router()

router.post('/register', singleUpload, register)
router.post('/login', login)
router.get('/logout', logout)
router.get('/profile', isAuthenticated, profile)
router.delete('/deleteprofile', isAuthenticated, deleteProfile)
router.put('/changepassword', isAuthenticated, changePassword)
router.put('/updateprofile', isAuthenticated, updateProfile)
router.put('/updateprofilepicture', isAuthenticated, singleUpload, updateProfilePicture)
router.post('/forgetpassword', forgetPassword)
router.put('/resetpassword/:token', resetPassword)
router.post('/addtoplaylist', isAuthenticated, addToPlayList)
router.delete('/removefromplaylist', isAuthenticated, removeFromPlayList)

router.get('/admin/users', isAuthenticated, authorizeAdmin, getAllUsers)
router.put('/admin/user/:id', isAuthenticated, authorizeAdmin, updateUserRole)
router.delete('/admin/user/:id', isAuthenticated, authorizeAdmin, deleteUser)

export default router