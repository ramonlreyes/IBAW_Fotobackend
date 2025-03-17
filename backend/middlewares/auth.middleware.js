import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

export const protect = async (req, res, next) => {

  try {
    const token = req.cookies.accessToken;

    if(!token){
      return res.status(401).json({success: false, message: 'Not authorized, PLease log in'});
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select('-password');

    if(!req.user){
      return res.status(401).json({success: false, message: 'User not found'});
    }
    next();
  } catch (error){
    console.error('Auth error:', error.message);
    res.status(401).json({success: false, message: 'Not authorized, session expired'});
  }
};

export const isAdmin = (req, res, next) => {
  if(req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({success: false, message: 'Admin access required'});
  }
};