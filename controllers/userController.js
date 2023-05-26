import { User } from '../models/User.js'
import { Course } from '../models/Course.js'
import { catchAsyncError } from '../middlewares/catchAsyncError.js'
import ErrorHandler from '../utils/errorHandler.js'
import { sendToken } from '../utils/sendToken.js'
import { sendMail } from '../utils/sendMail.js'
import crypto from 'crypto'
import cloudinary from 'cloudinary'
import getDataUri from '../utils/dataUri.js'
import { Stats } from '../models/Stats.js'

export const register = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body
    const file = req.file

    // console.log(name,email,password,file)

    if (!name || !email || !password || !file) {
        return next(new ErrorHandler("Please Enter All Fields", 400))
    }

    let user = await User.findOne({ email })
    if (user)
        return next(new ErrorHandler("User Already Exists", 409))

    const fileUri = getDataUri(file)
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, { folder: "Users" })

    user = await User.create({
        name, email, password, avatar: { public_id: mycloud.public_id, url: mycloud.secure_url }
    })

    sendToken(res, user, "User Successfully Register", 201)

})

export const login = catchAsyncError(async (req, res, next) => {

    const { email, password } = req.body

    if (!email || !password)
        return next(new ErrorHandler("Please Enter All Fields", 400))

    const user = await User.findOne({ email }).select("+password")

    if (!user)
        return next(new ErrorHandler("Invalid Credential", 401))

    const match = await user.comparePassword(password)

    if (!match)
        return next(new ErrorHandler("Invalid Credentials", 401))

    sendToken(res, user, `Welcome back, ${user.name}`, 200)
})

export const logout = catchAsyncError(async (req, res, next) => {
    res.status(200).cookie("token", null, {
        expires: new Date(Date.now())
    }).json({
        success: true,
        message: "Successfully Logged out"
    })
})

export const profile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    res.status(200).json({ success: true, user })
})

export const deleteProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    await user.deleteOne()
    res.status(200).cookie("token", null, { expires: new Date(Date.now()) }).json({ success: true, message: "User Deleted" })
})

export const changePassword = catchAsyncError(async (req, res, next) => {

    const { oldPassword, newPassword } = req.body
    if (!oldPassword || !newPassword)
        return next(new ErrorHandler("Please enter all fields", 400))
    const user = await User.findById(req.user._id).select("+password")
    const match = await user.comparePassword(oldPassword)
    if (!match)
        return next(new ErrorHandler("Incorrect Old Passoword", 400))
    user.password = newPassword
    await user.save()
    res.status(200).json({ success: true, message: "Password Successfully Changed" })
})

export const updateProfile = catchAsyncError(async (req, res, next) => {

    const { name, email } = req.body

    const user = await User.findById(req.user._id)

    if (name) user.name = name
    if (email) user.email = email

    await user.save()
    res.status(200).json({ success: true, message: "Profile Successfully Updated" })
})

export const updateProfilePicture = catchAsyncError(async (req, res, next) => {

    const file = req.file
    const user = await User.findById(req.user._id)
    const fileUri = getDataUri(file)
    const mycloud = await cloudinary.v2.uploader.upload(fileUri.content, { folder: "Users" })
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    user.avatar = {
        public_id: mycloud.public_id,
        url: mycloud.secure_url
    }

    await user.save()

    res.status(200).json({ success: true, message: "Profile Picture Successfully Updated" })
})

export const forgetPassword = catchAsyncError(async (req, res, next) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) return next(new ErrorHandler("User Not Found", 400))
    const resetToken = await user.getResetToken()
    await user.save()
    const url = `${process.env.FRONTEND_URL}/resertpassword/${resetToken}`
    const message = `Click on the link to reset your password. ${url}. If you hane not request than please ignore.`
    await sendMail(user.email, "TechCourse Reset Password", message)
    res.status(200).json({ success: true, message: `Reset Password Token has been sent to ${user.email}` })
})

export const resetPassword = catchAsyncError(async (req, res, next) => {
    const { token } = req.params
    const resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({ resetPasswordToken, resetPasswordExpire: { $gt: Date.now() } })
    if (!user) return next(new ErrorHandler("Token is invalid or has been expired.", 401))
    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    res.status(200).json({ success: true, message: "Password Successfully Reset", token })
})

export const addToPlayList = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const course = await Course.findById(req.body.id)
    if (!course) return next(new ErrorHandler("Invalid Course Id", 404))
    const itemExist = user.playlist.find((item) => {
        if (item.course.toString() === course._id.toString()) return true
    })
    if (itemExist) return next(new ErrorHandler("Item Already in Playlist", 409))
    user.playlist.push({
        course: course._id,
        poster: course.poster.url
    })
    await user.save()
    res.status(200).json({ success: true, message: "Added to Playlist" })
})

export const removeFromPlayList = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user._id)
    const course = await Course.findById(req.query.id)
    if (!course) return next(new ErrorHandler("Invalid Course Id", 404))
    const newPlaylist = user.playlist.filter((item) => {
        if (item.course.toString() !== course._id.toString()) return true
    })
    user.playlist = newPlaylist
    await user.save()
    res.status(200).json({ success: true, message: "Removed from Playlist" })
})

export const getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find({})
    res.status(200).json({ success: true, users })
})

export const updateUserRole = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler("User Not FOund", 404))
    if (user.role === "user") user.role = "admin"
    else user.role = "user"
    await user.save()
    res.status(200).json({ success: true, message: "Role Updated" })
})

export const deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id)
    if (!user) return next(new ErrorHandler("User Not Found", 404))
    await cloudinary.v2.uploader.destroy(user.avatar.public_id)
    await user.deleteOne()
    res.status(200).json({ success: true, message: "User Deleted" })
})

User.watch().on("change", async () => {
    const stats = await Stats.find({}).sort({ createdAt: "desc" }).limit(1)
    const subscription = await User.find({ "subscription.status": "acitve" })
    stats[0].users = await User.countDocuments()
    stats[0].subscripiton = subscription.length
    stats[0].createdAt = new Date(Date.now())
    await stats.save()
})