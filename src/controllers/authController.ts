import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password, rememberMe } = req.body;
    try {
        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        if (error || !user) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
            return;
        }
        // Generate JWT with longer expiry if rememberMe is true
        const token = jwt.sign(
            { id: user.id, role_id: user.role_id }, 
            JWT_SECRET, 
            { expiresIn: rememberMe ? '30d' : '24h' }
        );
        res.json({ success: true, user: { ...user, password: undefined }, token });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Login failed', error: (err as any).message });
    }
};

export const getMe = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        // User info is attached by auth middleware
        const userId = req.user?.id;
        if (!userId) {
            res.status(401).json({ success: false, message: 'Unauthorized' });
            return;
        }
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', userId)
            .single();
        if (error || !user) {
            res.status(404).json({ success: false, message: 'User not found' });
            return;
        }
        res.json({ success: true, user: { ...user, password: undefined } });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Failed to fetch user', error: (err as any).message });
    }
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;
    try {
        // Find user
        const { data: user, error } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();
        
        if (error || !user) {
            // Don't reveal if email exists, security reason
            res.json({ 
                success: true, 
                message: 'If your email is registered, you will receive a password reset link' 
            });
            return;
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date();
        resetTokenExpiry.setHours(resetTokenExpiry.getHours() + 1);

        // Store reset token in database
        const { error: updateError } = await supabase
            .from('users')
            .update({
                reset_token: resetToken,
                reset_token_expires_at: resetTokenExpiry
            })
            .eq('id', user.id);

        if (updateError) {
            res.status(500).json({ 
                success: false, 
                message: 'Error generating reset token', 
                error: updateError.message 
            });
            return;
        }

        // In a real app, you would send an email here with the reset link, but for dev sake, we'll return the token for now
        res.json({ 
            success: true, 
            message: 'If your email is registered, you will receive a password reset link',
            // Remove this in prod
            resetToken: resetToken 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error processing forgot password request', 
            error: (err as any).message 
        });
    }
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;
    try {
        // Find user with valid reset token
        const { data: user, error } = await supabase
            .from('users')
            .select('id, reset_token, reset_token_expires_at')
            .eq('reset_token', token)
            .single();

        if (error || !user || new Date() > new Date(user.reset_token_expires_at)) {
            res.status(400).json({ 
                success: false, 
                message: 'Invalid or expired reset token' 
            });
            return;
        }

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update password and clear reset token
        const { error: updateError } = await supabase
            .from('users')
            .update({
                password: hashedPassword,
                reset_token: null,
                reset_token_expires_at: null
            })
            .eq('id', user.id);

        if (updateError) {
            res.status(500).json({ 
                success: false, 
                message: 'Error resetting password', 
                error: updateError.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            message: 'Password has been reset successfully' 
        });

    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error resetting password', 
            error: (err as any).message 
        });
    }
}; 