import jwt  from 'jsonwebtoken';

const UserAuth = (req, res, next) => {
    const token = req.cookies.token
    if(!token) {
        return res.status(401).json({success: false, message: "Unauthorized: No token provided"});
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        req.userId = decoded.id;  // Add this line to set userId
        console.log('UserAuth middleware - decoded token:', decoded); // Debug log
        next();
    } catch (error) {
        return res.status(401).json({success: false, message: "Unauthorized: Invalid token"});
    }
};

export default UserAuth;