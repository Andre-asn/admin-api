import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

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
        // Always set role to 'patient' for registration
        const role = 'patient';
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
                role
            }])
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error creating user', error: error.message });
            return;
        }
        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({ success: true, user: { ...user, password: undefined }, token });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Registration failed', error: (err as any).message });
    }
};

export const login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;
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
        // Generate JWT
        const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
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