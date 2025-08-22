import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const verifySocketToken = async (socket, next) => {
  try {
    //Get token from handshake (not cookies)
    const token = socket.handshake.auth.token;
    
    if (!token) {
      return next(new Error('Access denied. No token provided.'));
    }

    // Verify with same JWT secret
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    //Check if user exists 
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('User not found.'));
    }

    // Attach to socket (not req)
    socket.userId = decoded.id;
    socket.userName = user.name;
    socket.userEmail = user.email;
    
    //Join user's personal room for private messages
    socket.join(socket.userId);
    
    console.log(`Socket auth success: ${user.name} (${user.email})`);
    
    next(); 
    
  } catch (err) {
    console.error('Socket token verification error:', err);
    return next(new Error('Invalid token.'));
  }
};
