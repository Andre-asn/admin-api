import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';

// List all roles
export const getRoles = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { data: roles, error } = await supabase
            .from('roles')
            .select('*')
            .order('id');

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching roles', 
                error: error.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            data: roles 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching roles', 
            error: err.message 
        });
    }
};

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

// List all permissions for a role
export const getRolePermissions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleId } = req.params;

        // First verify if the role exists
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('id', roleId)
            .single();

        if (roleError || !role) {
            res.status(404).json({ 
                success: false, 
                message: 'Role not found' 
            });
            return;
        }

        // Get role permissions with module and permission details
        const { data: permissions, error } = await supabase
            .from('role_module_permissions')
            .select(`
                module_id,
                permission_id,
                modules (
                    id,
                    name,
                    description
                ),
                permissions (
                    id,
                    name,
                    description
                )
            `)
            .eq('role_id', roleId);

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching role permissions', 
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
            message: 'Error fetching role permissions', 
            error: err.message 
        });
    }
};

export const createRole = async (req: Request, res: Response): Promise<void> => {
    const { name, modulePermissions } = req.body;
    if (!name || !Array.isArray(modulePermissions)) {
        res.status(400).json({ success: false, message: 'Missing role name or modulePermissions' });
        return;
    }
    try {
        // Check for duplicate role name
        const { data: existingRole } = await supabase
            .from('roles')
            .select('id')
            .eq('name', name)
            .single();
        if (existingRole) {
            res.status(409).json({ success: false, message: 'Role already exists' });
            return;
        }
        // Create the new role
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .insert([{ name }])
            .select()
            .single();
        if (roleError || !role) {
            res.status(500).json({ success: false, message: 'Error creating role', error: roleError?.message });
            return;
        }
        // Prepare role_module_permissions inserts
        const permissionRows = [];
        for (const mp of modulePermissions) {
            const { module_id, permission_id } = mp;
            if (!Number.isInteger(module_id) || !Array.isArray(permission_id)) {
                res.status(400).json({ success: false, message: 'Invalid moduleId or permissionIds in modulePermissions' });
                return;
            }
            for (const permissionId of permission_id) {
                if (!Number.isInteger(permissionId)) {
                    res.status(400).json({ success: false, message: 'Invalid permissionId in permissionIds array' });
                    return;
                }
                permissionRows.push({
                    role_id: role.id,
                    module_id: module_id,
                    permission_id: permissionId
                });
            }
        }
        console.log('permissionRows:', permissionRows);
        if (permissionRows.length === 0) {
            res.status(400).json({ success: false, message: 'No permissions to assign. Check your modulePermissions input.' });
            return;
        }
        const { error: permError } = await supabase
            .from('role_module_permissions')
            .insert(permissionRows);
        if (permError) {
            res.status(500).json({ success: false, message: 'Error assigning permissions', error: permError.message });
            return;
        }
        res.status(201).json({
            success: true,
            role: {
                id: role.id,
                name: role.name,
                modulePermissions
            }
        });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error creating role', error: err.message });
    }
};