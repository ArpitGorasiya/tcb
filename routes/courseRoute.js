import express from 'express'
import { addLecture, createCourse, deleteCourse, deleteLecture, getAllCourses, getCourseLectures } from '../controllers/courseController.js'
import singleUpload from '../middlewares/multer.js'
import { authorizeAdmin, authorizeSubscribers, isAuthenticated } from '../middlewares/auth.js'

const router = express.Router()

router.get('/courses', isAuthenticated, getAllCourses)
router.post('/createcourse', isAuthenticated, authorizeAdmin, singleUpload, createCourse)
router.get('/course/:id', isAuthenticated, authorizeSubscribers, getCourseLectures)
router.post('/course/:id', isAuthenticated, authorizeAdmin, singleUpload, addLecture)
router.delete('/lecture', isAuthenticated, authorizeAdmin, deleteLecture)
router.delete('/course/:id', isAuthenticated, authorizeAdmin, deleteCourse)

export default router