export const sendToken = (res, user, message, status) => {

    const token = user.getJWTToken()
    const options = {
        expires: new Date(Date.now() + 15 * 60 * 60 * 1000),
        httpOnly: true,
        // secure: true,
        sameSite: true
    }

    res.status(status).cookie("token", token, options).json({
        success: true,
        message,
        user
    })
}