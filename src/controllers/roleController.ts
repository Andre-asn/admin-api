import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

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
                modules (
                    id,
                    name
                ),
                permissions (
                    id,
                    name
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

        // Group permissions by module
        const modulePermissionsMap = new Map();
        
        permissions?.forEach((perm: any) => {
            const moduleId = perm.modules.id;
            const moduleName = perm.modules.name;
            
            if (!modulePermissionsMap.has(moduleId)) {
                modulePermissionsMap.set(moduleId, {
                    module_id: moduleId,
                    module_name: moduleName,
                    permissions: []
                });
            }
            
            modulePermissionsMap.get(moduleId).permissions.push({
                id: perm.permissions.id,
                name: perm.permissions.name
            });
        });

        const groupedPermissions = Array.from(modulePermissionsMap.values());

        res.json({ 
            success: true, 
            data: groupedPermissions 
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

export const updateRole = async (req: Request, res: Response): Promise<void> => {
    try {
        const { roleId } = req.params;
        const { name, modulePermissions } = req.body;

        // First verify if the role exists
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('id', roleId)
            .single();
        if (roleError || !role) {
            res.status(404).json({ success: false, message: 'Role not found' });
            return;
        }

        // Check if new name is currently in use
        if (name) {
            const { data: existingRole } = await supabase
                .from('roles')
                .select('id')
                .eq('name', name)
                .neq('id', roleId)
                .single();
            if (existingRole) {
                res.status(409).json({ success: false, message: 'Role name already in use' });
                return;
            }
        }

         // Start a transaction to update role and permissions
         const { error: transactionError } = await supabase.rpc('update_role_transaction', {
            p_role_id: roleId,
            p_name: name || undefined,
            p_module_permissions: modulePermissions.flatMap((mp: any) => 
                mp.permission_id.map((pid: any) => ({
                    role_id: roleId,
                    module_id: mp.module_id,
                    permission_id: pid
                }))
            )
        });

        if (transactionError) {
            res.status(500).json({ 
                success: false, 
                message: 'Error updating role, check your permission or module IDs', 
            });
            return;
        }

        res.json({
            success: true,
            message: 'Role updated successfully', 
        });

    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error updating role', 
            error: err.message 
        });
    }
};

export const deleteRole = async (req: Request, res: Response): Promise<void> => {
}



    
