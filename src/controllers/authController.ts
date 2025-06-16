import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';
import crypto from 'crypto';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const RESET_TOKEN_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export const register = async (req: Request, res: Response): Promise<void> => {
    const { email, password, firstName, lastName, gender, dob } = req.body;
    try {
        // Check if user already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        if (existingUser) {
            res.status(400).json({ success: false, message: 'Email already registered' });
            return;
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Fetch role_id for 'patient'
        const { data: roleData } = await supabase
            .from('roles')
            .select('id')
            .eq('name', 'patient')
            .single();
        if (!roleData) {
            res.status(500).json({ success: false, message: 'Role not found' });
            return;
        }
        // Create user
        const { data: user, error } = await supabase
            .from('users')
            .insert([{
                email,
                password: hashedPassword,
                first_name: firstName,
                last_name: lastName,
                gender,
                dob,
                role_id: roleData.id
            }])
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
            return;
        }
        // Generate JWT
        const token = jwt.sign({ id: user.id, role_id: user.role_id }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ success: true, user: { ...user, password: undefined }, token });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Registration failed', error: (err as any).message });
    }
};

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
        const resetTokenExpiry = new Date(Date.now() + RESET_TOKEN_EXPIRY);

        // Store reset token in database
        const { error: updateError } = await supabase
            .from('users')
            .update({
                reset_token: resetToken,
                reset_token_expiry: resetTokenExpiry
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
            message: 'Password reset link sent to your email',
            // Remove this in production
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
            .select('*')
            .eq('reset_token', token)
            .gt('reset_token_expiry', new Date().toISOString())
            .single();

        if (error || !user) {
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
                reset_token_expiry: null
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