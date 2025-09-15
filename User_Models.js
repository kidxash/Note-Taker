import { mongoose } from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    verifyOtp: { type: String, required: false },
    isAccountVerified: { type: Boolean, default: false },
    resetOTP: { type: String, required: false },
    resetOTPExpireAt: {type: Number, default: 0},

});

const User = mongoose.model("User", userSchema);

export default User;
