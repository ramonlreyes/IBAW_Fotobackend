import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateTokens = (user) => {
  const accessToken =  jwt.sign({ userId: user._id, role: user.role  }, process.env.JWT_SECRET, {
    expiresIn: '15m'
  });

  const refreshToken = jwt.sign(
    { userId: user._id, tokenType: 'refresh'},
    process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET,
    { expiresIn: '7d'}
  );

  return { accessToken, refreshToken };
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

      const { accessToken, refreshToken } = generateTokens(newUser);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', refreshToken, {
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

    const { accessToken, refreshToken } = generateTokens(user);

      res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000
      });

      res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.status(200).json({
      success: true,
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

export const logoutUser = async(req, res) => {
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0)
  });

  res.status(200).json({success: true, message: 'Logged out successfully'});
};

export const refreshToken = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({success: false, message: 'No refresh Tkoen provided'})
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET);

    if (decoded.tokenType !== 'refresh') {
      return res.status(401).json({ success: false, message: 'Invalid token Type'});
    }

    const user = await User.findById(decoded.userId).select('-password');

    if (!user) {
      return res.status(401).json({success: false, message: 'User not found'});
    }

    const accessToken = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    res.cookie('accessToken', accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000
    });

    res.status(200).json({
      success: true,
      message: 'Token refreshed successfully',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Token refresh error:', error.message);
    res.status(401).json({success: false, message: 'Invalid or expired refresh token'})
  }
};

export const verifyToken = async (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user_id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role
    }
  });
};
