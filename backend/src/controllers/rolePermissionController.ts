import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

// List all roles
export const getRoles = async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('roles').select('*');
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, data });
};

// List all permissions
export const getPermissions = async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('permissions').select('*');
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, data });
};

// List all modules
export const getModules = async (_req: Request, res: Response): Promise<void> => {
    const { data, error } = await supabase.from('modules').select('*');
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, data });
};

// List all permissions for a role
export const getRolePermissions = async (req: Request, res: Response): Promise<void> => {
    const { roleId } = req.params;
    const { data, error } = await supabase
        .from('role_module_permissions')
        .select('module_id, permission_id')
        .eq('role_id', roleId);
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, data });
};

// Assign permission to a role for a module
export const assignRolePermission = async (req: Request, res: Response): Promise<void> => {
    const { roleId, moduleId, permissionId } = req.body;
    const { error } = await supabase
        .from('role_module_permissions')
        .insert([{ role_id: roleId, module_id: moduleId, permission_id: permissionId }]);
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, message: 'Permission assigned to role.' });
};

// Remove permission from a role for a module
export const removeRolePermission = async (req: Request, res: Response): Promise<void> => {
    const { roleId, moduleId, permissionId } = req.body;
    const { error } = await supabase
        .from('role_module_permissions')
        .delete()
        .eq('role_id', roleId)
        .eq('module_id', moduleId)
        .eq('permission_id', permissionId);
    if (error) {
        res.status(500).json({ success: false, message: error.message });
        return;
    }
    res.json({ success: true, message: 'Permission removed from role.' });
}; 