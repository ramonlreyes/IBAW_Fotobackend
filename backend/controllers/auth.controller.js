import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (user) => {
  return jwt.sign({ userId: user._id, role: user.role  }, process.env.JWT_SECRET, {
    expiresIn: '7d'
  });
};

export const registerUser = async (req, res) => {
  const {name, email, password, role} = req.body;

  if(!name || !email || !password) {
    return res.status(400).json({success: false, message:'All field are required'})
  }

  try {
    const userExist = await User.findOne({email});
    if(userExist) {
      return res.status(400).json({success: false, message: 'User already exists'});
    }

    const newUser = await User.create({name, email, password, role});

    if(newUser) {

      const token = generateToken(user);

      res.cookie('accessToken', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

      res.status(201).json({ 
        success: true,
        user: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role || 'user'
        }
      });
    } else {
      res.status(400).json({success: false, message:'Invalid user Data'});
    }
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error', error: error.message});
  }

};

export const loginUser = async (req, res) => {
  const { email, password} = req.body;

  if(!email || !password) {
    return res.status(400).json({success: false, message:'All field are required'})
  }

  try {
    const user = await User.findOne({ email });

    if(!user) {
      return res.status(401).json({success: false, message: 'Invalid Email or Password'});
    }

    const isMatch = await user.matchPassword(password);

    if(!isMatch) {
      return res.status(401).json({success: false, message: 'Invalid Email or Password'});
    }

    const token = generateToken(user);

    res.cookie('accessToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000
    })

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      },
    });
  } catch (error) {
    res.status(500).json({success: false, message: 'Server Error', error: error.message});
  }

};

export const logoutUSer = async(req, res) => {
  res.cookie('accesToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({success: true, message: 'Logged out successfully'});
};

