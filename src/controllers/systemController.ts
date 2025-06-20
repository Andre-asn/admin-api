import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

// List all permissions
export const getPermissions = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { data: permissions, error } = await supabase
            .from('permissions')
            .select('*')
            .order('id');

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching permissions', 
                error: error.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            data: permissions 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching permissions', 
            error: err.message 
        });
    }
};

// List all modules
export const getModules = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { data: modules, error } = await supabase
            .from('modules')
            .select('*')
            .order('id');

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching modules', 
                error: error.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            data: modules 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching modules', 
            error: err.message 
        });
    }
};

// Create a new module
export const createModule = async (req: Request, res: Response): Promise<void> => {
    try {
        const { name, slug } = req.body;

        if (!name) {
            res.status(400).json({
                success: false,
                message: 'Module name is required'
            });
            return;
        }

        const { data: modules, error } = await supabase
            .from('modules')
            .insert([{ name, slug }])
            .select();

        if (error) {
            res.status(500).json({
                success: false,
                message: 'Error creating module',
                error: error.message
            });
            return;
        }

        res.json({
            success: true,
            message: 'Module created successfully',
            data: modules
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: 'Error creating module',
            error: err.message
        });
    }
};
