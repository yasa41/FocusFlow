import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';

export const register = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.json({
            success: false, message: 'missing details'
        })
    }
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.json({ success: false, message: "user already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ name, email, password: hashedPassword })
        await user.save();
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, token });
    } catch (error) {
        res.json({ success: false, message: error.message })
    }
}
export const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.json({ success: false, message: 'missing details' })
    }
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            return res.json({ success: false, message: 'password or email is invalid' })
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ success: false, message: 'Invalid passsword or email' })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

        res.cookie('token', token, {
            httpOnly: true, secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
        });

        return res.json({ success: true, token });

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
export const logout = async (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', path: '/'
        })
        return res.json({
            success: true, message: "logged out"
        })

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
}
export const updateProfile = async (req, res) => {
    try {
        const { avatar, bio, interests } = req.body;
        const userId = req.user.id;

        const user = await userModel.findByIdAndUpdate(
            userId,
            {
                avatar,
                bio,
                interests,
            },
            { new: true, runValidators: true }
        ).select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            message: "Profile updated successfully",
            user
        });
    } catch (error) {
        console.error('Profile update error:', error);
        return res.json({ success: false, message: error.message });
    }
};

// Add this function to get current user data
export const getCurrentUser = async (req, res) => {
    try {
        const user = await userModel.findById(req.user.id)
            .select('-password -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            return res.json({ success: false, message: "User not found" });
        }

        return res.json({
            success: true,
            user
        });
    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};