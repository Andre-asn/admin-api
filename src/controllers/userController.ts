import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

export const createUser = async (req: Request, res: Response): Promise<void> => {
    const { name, email, roleId } = req.body;
    if (!name || !email || !roleId) {
        res.status(400).json({ success: false, message: 'Missing required fields' });
        return;
    }
    try {
        // Split name into first and last
        const [first_name, ...lastArr] = name.trim().split(' ');
        const last_name = lastArr.join(' ');
        // Check for duplicate email
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();
        if (existingUser) {
            res.status(409).json({ success: false, message: 'Email already exists' });
            return;
        }
        // Generate a temp password
        const tempPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(tempPassword, 10);
        // Insert user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert([{
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role_id: roleId,
            }])
            .select()
            .single();
        if (userError || !user) {
            res.status(500).json({ success: false, message: 'Error creating user', error: userError?.message });
            return;
        }
        res.status(201).json({
            success: true,
            user: {
                id: user.id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role_id: user.role_id,
                status: user.status,
                tempPassword // Remove this in production!
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error creating user', error: err.message });
    }
}; 