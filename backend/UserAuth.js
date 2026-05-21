import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserAuth from "./MiddleWear/userdataAuth.js";
import userModel from "../User_Models.js";
import transporter from "./nodemailer.js";

export const login = async (req, res) => {
    const { email, password } = req.body;
    if(!email || !password) {
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }
    try {
        const user = await mongoose.model("User").findOne({ email });
        if(!user) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch) {
            return res.status(400).json({success: false, message: "Invalid credentials"});
        }
         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        res.status(200).json({success: true, message: "Login successful", data: { token, username: user.username }});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server error"});

    }
};
export const register = async (req, res) => {
    // accept either `name` or `username` from the client for convenience
    const { username, email, password, name } = req.body
    const resolvedUsername = username || name;

    if(!resolvedUsername || !email || !password) {
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }
    try {
        const existingUser = await userModel.findOne({email});
        if(existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new userModel({
            username: resolvedUsername,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        // generate token and set cookie
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });

        // Send welcome email (non-blocking) but log any failure
        (async () => {
            try {
                const mailOptions = {
                    // From address should be a verified sender in your SMTP provider (Brevo)
                    from: process.env.SENDER_EMAIL || process.env.SMTP_USER,
                    to: email,
                    subject: 'Welcome to Our Service',
                    text: `Hello ${resolvedUsername},\n\nThank you for registering with us! Your account has been successfully created with email: ${email}\n\nBest regards,\nThe Team`
                }

                const info = await transporter.sendMail(mailOptions);
                console.log('Welcome email sent successfully to:', email, 'info:', info);
            } catch (emailError) {
                console.error('Email sending failed for', email, emailError);
            }
        })();

        // Respond once to the client
        return res.status(201).json({success: true, message: 'User registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: error.message});
    }

    
}
export const logout = async (req, res) => {
    try{
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        })
        return res.json({success: true, message: "Logged Out"})

    }catch(error){
        return res.json({success: false, message: error.message})
    }
    
}

export const sendVerifyOTP = async (req, res) => {
    try {
        const userId = req.userId;
        
        // Debug: Log the userId to see what we're getting
        console.log('SendVerifyOTP - Looking for user with ID:', userId);
        console.log('UserId type:', typeof userId);

        const user = await userModel.findById(userId);
        
        // Debug: Log if user was found
        if (!user) {
            console.log('SendVerifyOTP - No user found with ID:', userId);
            // Let's also try to find any user to see if database connection works
            const anyUser = await userModel.findOne({});
            console.log('Any user in database?', anyUser ? 'Yes' : 'No');
            return res.json({success: false, message: 'User not found'});
        }
        
        console.log('SendVerifyOTP - User found:', user.email);
        
        if(user.isAccountVerified){
            return res.json({success: false, message: "Account already verified"})
        }

    const otp =  String(Math.floor(100000 + Math.random() * 900000))

     user.verifyOTP = otp;
     user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const  mailOptions = {
          from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verification OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
    }

    await transporter.sendMail(mailOptions);

    res.json({success: true, message: 'Verification OTP sent to email'})

        } catch (error) {
        res.json({success: false, message: error.message})
        
    }


}
export const verifyEmail = async (req, res) => {
           const userId = req.userId;
           const {otp} = req.body;

            if(!otp || !userId){
                return res.json({success:false, message: 'Missing details'})
            }

            try {
                 console.log('VerifyEmail - Looking for user with ID:', userId);
                 const user = await userModel.findById(userId)
                 if(!user)
                 {
                console.log('VerifyEmail - No user found with ID:', userId);
                return res.json({success:false, message: 'User not found'});

                 }
                 if(user.verifyOTP === '' || user.verifyOTP !== otp){
                    return res.json({success:false, message: 'Invalid OTP'});
                 }
                 if(user.verifyOTPExpireAt < Date.now()){
                 return res.json({success:false, message: 'OTP expired'});
                 }

                 user.isAccountVerified = true
                 user.verifyOTP = ''
                 user.verifyOTPExpireAt = 0;

                 await user.save()

                 return res.json({success: true, message: 'Email verified successfully'})

                
            } catch (error) {
                 return res.json({success:false, message: error.message})

            }


}
export const isAuthenticated = async (req, res) => {
    try{
        res.json({success: true })
    }catch(error)
    {
        res.json({success: false, message: error.message})
    }
    
}

export const sendResetOtp =async (req, res)=>{
    const{ email} =req.body

    if(!email){
        return res.json({success: false, message: 'email is required'})
    }

    try {

        const  user = await userModel.findOne({email});
        
        if(!user)
        {
          return res.json({success: false, message: 'user not found '})
          
        }
        const otp =  String(Math.floor(100000 + Math.random() * 900000))

     user.resetOTP = otp;
     user.resetOTPExpireAt = Date.now() + 15 * 60 * 1000
    await user.save()

    const  mailOptions = {
          from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Password Reset OTP',
            text: `Your OTP is ${otp}. This is to reset your password`
    }

    await transporter.sendMail(mailOptions);

    res.json({success: true, message: 'OTP sent to your email' })

        
    } catch (error) {
        res.json({success: false, message: error.message})

    }
}

export const resetPassword =async (req, res) => {
 const {email, otp, newPassword} = req.body

 if(!email|| !otp || !newPassword){
    res.json({success: false, message: "email, otp, and new password are  required"})
 }
 try {
    const user = await userModel.findOne({email})
    if(!user){
        return res.json({success: false, message: "user not found"})
    }
    if(user.resetOTP === '' || user.resetOTP !==otp){
         res.json({success: false, message: "invaild OTP"});
    }
    if(user.resetOTPExpireAt < Date.now()){
    return res.json({success: false, message: "otp expired"})

    }
    const hashedPassword = await  bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;

    user.resetOTP = otp ;
    user.resetOTPExpireAt = 0;
    await user.save();

    return res.json({success: true, messsage: 'Password has been reset successfully'});
    
 } catch (error) {
    res.json({success: false, message: error.message})

 }
}





