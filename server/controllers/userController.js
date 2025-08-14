
import userModel from '../models/userModel.js';

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