import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import UserAuth from "./MiddleWear/userdataAuth";

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
        res.status(200).json({success: true, message: "Login successful", data: { token }});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server error"});

    }
};
export const register = async (req, res) => {
    const { name, email, password } = req.body

    if(!name  || !email || !password) {
        return res.status(400).json({success: false, message: "Please fill in all fields"});
    }
    try {
        const existingUser =await user.findOne({email });
        if(existingUser) {
            return res.status(400).json({success: false, message: "User already exists"});
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new user({
            name ,
            email,
            password: hashedPassword,
        });
        await newUser.save();
        res.status(201).json({success: true, message: "User registered successfully"});

        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production' });


        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Welcome to Our Service',
            text: `Hello ${name},\n\nThank you for registering with us! Your account has been successfully created ${email}`
        };

        await transporter.sendMail(mailOptions);
          res.json({success: true, message: 'User registered successfully'});
    } catch (error) {
        console.error(error);
        res.status(500).json({success: false, message: "Server error"});
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

    const user = await userModel.findById(userId);
    if(user.isAccountVerified){
        return res.json({success: false, message: "account already verfifed"})
    }

    const otp =  String(Math.floor(100000 + Math.random() * 900000))

     user.verifyOTP = otp;
        user.verifyOTPExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save()

    const  mailOptions = {
          from: process.env.SENDER_EMAIL,
            to: user.email,
            subject: 'Account Verfication OTP',
            text: `Your OTP is ${otp}. Verify your account using this OTP.`
    }

    await transporter.sendMail(mailOptions);

    res.json({success: true, message: 'Verification OTP Send Email'})

        } catch (error) {
        res.json({success: false, message: error.message})
        
    }


}
export const verifyEmail = async (req, res) => {
           const userId = req.userId;
           const {otp} = req.body;

            if(!otp || !userId){
                return res.json({sucess:false, message: 'missing Details'})
            }

            try {
                 const user = await userModel.findById(userId)
                 if(!user)
                 {
                return res.json({success:false, message: 'User not found'});

                 }
                 if(user.verifyOTP === '' || user.verifyOTP !== otp){
                    return res.json({success:false, message: 'Invalid OTP'});
                 }
                 if(user.verifyOTPExpireAt < Date.now()){
                 return res.json({sucess:false, message: 'OTP expried'});
                 }

                 user.isAccountVerified = true
                 user.verifyOTP = ''
                 user.verifyOTPExpireAt = 0;

                 await user.save()

                 return res.json({success: true, message: 'email verified successfully'})

                
            } catch (error) {
                 return res.json({success:false, message: error.messsage})

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





