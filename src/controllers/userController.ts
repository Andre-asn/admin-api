import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Get all users with optional filters
export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role_id, status } = req.query;

        // Start building the query
        let query = supabase
            .from('users')
            .select(`
                id,
                first_name,
                last_name,
                email,
                status,
                created_at,
                updated_at,
                role_id,
                roles (
                    id,
                    name
                )
            `);

        // Apply filters if provided
        if (role_id) {
            query = query.eq('role_id', role_id);
        }
        if (status) {
            query = query.eq('status', status);
        }

        const { data: users, error } = await query;

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching users', 
                error: error.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            data: users 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching users', 
            error: err.message 
        });
    }
};

export const createUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { first_name, last_name, email, password, role_id } = req.body;

        // Check if email already exists
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('email', email)
            .single();

        if (existingUser) {
            res.status(409).json({ success: false, message: 'Email already in use' });
            return;
        }

        // Check if role exists
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('id', role_id)
            .single();

        if (roleError || !role) {
            res.status(400).json({ success: false, message: 'Invalid role ID' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const { data: user, error: userError } = await supabase
            .from('users')
            .insert({
                first_name,
                last_name,
                email,
                password: hashedPassword,
                role_id,
                status: 'active',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            })
            .select()
            .single();

        if (userError || !user) {
            res.status(500).json({ success: false, message: 'Error creating user', error: userError?.message });
            return;
        }

        res.status(201).json({ success: true, data: user });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error creating user', error: err.message });
    }
};