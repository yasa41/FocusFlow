import jwt from 'jsonwebtoken';
import { default as userModel } from '../models/userModel.js';

export const verifySocketToken = async (socket, next) => {
  try {
    // Access cookie header from socket handshake
    const cookieHeader = socket.handshake.headers.cookie || '';
    const cookies = {};
    cookieHeader.split(';').forEach(cookie => {
      const [name, ...rest] = cookie.trim().split('=');
      if (!name) return;
      cookies[name] = decodeURIComponent(rest.join('='));
    });

    const token = cookies['token'];
    if (!token) {
      return next(new Error('Authentication error: Token not found in cookie'));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await userModel.findById(decoded.id).select('-password');
    if (!user) {
      return next(new Error('Authentication error: User not found'));
    }

    // Attach user info to socket for downstream usage
    socket.userId = user._id.toString();
    socket.userName = user.name;
    socket.userEmail = user.email;

    // Join user personal socket room for direct messaging
    socket.join(socket.userId);


    next();
  } catch (err) {
    console.error('Socket authentication failed:', err);
    next(new Error('Authentication error'));
  }
};
