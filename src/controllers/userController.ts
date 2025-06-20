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
    const { name, email, role_id } = req.body;
    if (!name || !email || !role_id) {
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

        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('id', role_id)
            .single();

        if (roleError || !role) {
            res.status(400).json({ success: false, message: 'Invalid role ID' });
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
                role_id: role_id,
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

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const { data: user, error } = await supabase
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
            `)
            .eq('id', id)
            .single();

        if (error || !user) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
            return;
        }

        res.json({ 
            success: true, 
            data: user 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching user', 
            error: err.message 
        });
    }
};

export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { first_name, last_name, email, role_id, status } = req.body;

        // Check if user exists
        const { data: existingUser, error: userCheckError } = await supabase
            .from('users')
            .select('id, email')
            .eq('id', id)
            .single();

        if (userCheckError || !existingUser) {
            res.status(404).json({ 
                success: false, 
                message: 'User not found' 
            });
            return;
        }

        // If email is being updated, check if it's already in use by another user
        if (email && email !== existingUser.email) {
            const { data: emailExists } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .neq('id', id)
                .single();

            if (emailExists) {
                res.status(409).json({ 
                    success: false, 
                    message: 'Email already in use by another user' 
                });
                return;
            }
        }

        // If role_id is provided, check if role exists
        if (role_id) {
            const { data: role, error: roleError } = await supabase
                .from('roles')
                .select('id')
                .eq('id', role_id)
                .single();

            if (roleError || !role) {
                res.status(400).json({ 
                    success: false, 
                    message: 'Invalid role ID' 
                });
                return;
            }
        }

        // Prepare update data
        const updateData: any = {
            updated_at: new Date().toISOString()
        };

        if (first_name !== undefined) updateData.first_name = first_name;
        if (last_name !== undefined) updateData.last_name = last_name;
        if (email !== undefined) updateData.email = email;
        if (role_id !== undefined) updateData.role_id = role_id;
        if (status !== undefined) updateData.status = status;

        // Update user
        const { data: updatedUser, error: updateError } = await supabase
            .from('users')
            .update(updateData)
            .eq('id', id)
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
            `)
            .single();

        if (updateError || !updatedUser) {
            res.status(500).json({ 
                success: false, 
                message: 'Error updating user', 
                error: updateError?.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            message: 'User updated successfully',
            data: updatedUser 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating user', 
            error: err.message 
        });
    }
};