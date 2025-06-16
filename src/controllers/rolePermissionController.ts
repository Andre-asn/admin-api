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

// Assign permission to a role for a module
export const assignRolePermission = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleId, moduleId, permissionId } = req.body;

        // Validate required fields
        if (!roleId || !moduleId || !permissionId) {
            res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: roleId, moduleId, and permissionId are required' 
            });
            return;
        }

        // Check if the role exists
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

        // Check if the module exists
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .select('id')
            .eq('id', moduleId)
            .single();

        if (moduleError || !module) {
            res.status(404).json({ 
                success: false, 
                message: 'Module not found' 
            });
            return;
        }

        // Check if the permission exists
        const { data: permission, error: permissionError } = await supabase
            .from('permissions')
            .select('id')
            .eq('id', permissionId)
            .single();

        if (permissionError || !permission) {
            res.status(404).json({ 
                success: false, 
                message: 'Permission not found' 
            });
            return;
        }

        // Check if the permission is already assigned
        const { data: existingPermission, error: checkError } = await supabase
            .from('role_module_permissions')
            .select('id')
            .eq('role_id', roleId)
            .eq('module_id', moduleId)
            .eq('permission_id', permissionId)
            .single();

        if (existingPermission) {
            res.status(400).json({ 
                success: false, 
                message: 'Permission is already assigned to this role for this module' 
            });
            return;
        }

        // Assign the permission
        const { data, error } = await supabase
            .from('role_module_permissions')
            .insert([{ 
                role_id: roleId, 
                module_id: moduleId, 
                permission_id: permissionId 
            }])
            .select()
            .single();

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error assigning permission', 
                error: error.message 
            });
            return;
        }

        res.status(201).json({ 
            success: true, 
            message: 'Permission assigned successfully', 
            data 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error assigning permission', 
            error: err.message 
        });
    }
};

// Remove permission from a role for a module
export const removeRolePermission = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleId, moduleId, permissionId } = req.body;

        // Validate required fields
        if (!roleId || !moduleId || !permissionId) {
            res.status(400).json({ 
                success: false, 
                message: 'Missing required fields: roleId, moduleId, and permissionId are required' 
            });
            return;
        }

        // Check if the permission is assigned
        const { data: existingPermission } = await supabase
            .from('role_module_permissions')
            .select('id')
            .eq('role_id', roleId)
            .eq('module_id', moduleId)
            .eq('permission_id', permissionId)
            .single();

        if (!existingPermission) {
            res.status(404).json({ 
                success: false, 
                message: 'Permission is not assigned to this role for this module' 
            });
            return;
        }

        // Remove the permission
        const { error } = await supabase
            .from('role_module_permissions')
            .delete()
            .eq('role_id', roleId)
            .eq('module_id', moduleId)
            .eq('permission_id', permissionId);

        if (error) {
            res.status(500).json({ 
                success: false, 
                message: 'Error removing permission', 
                error: error.message 
            });
            return;
        }

        res.json({ 
            success: true, 
            message: 'Permission removed successfully' 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error removing permission', 
            error: err.message 
        });
    }
};
