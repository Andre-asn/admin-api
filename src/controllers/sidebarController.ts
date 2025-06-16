import { Response } from 'express';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';

// Get modules for sidebar based on user role
export const getSidebarModules = async (req: IGetUserAuthInfoRequest, res: Response): Promise<void> => {
    try {
        if (!req.user) {
            res.status(401).json({ 
                success: false, 
                message: 'Unauthorized' 
            });
            return;
        }

        const { role_id } = req.user;

        // Get the role first
        const { data: role, error: roleError } = await supabase
            .from('roles')
            .select('id')
            .eq('id', role_id)
            .single();

        if (roleError || !role) {
            res.status(404).json({ 
                success: false, 
                message: 'Role not found' 
            });
            return;
        }

        // Get the read permission id
        const { data: readPermission, error: permissionError } = await supabase
            .from('permissions')
            .select('id')
            .eq('name', 'read')
            .single();

        if (permissionError || !readPermission) {
            res.status(404).json({ 
                success: false, 
                message: 'Read permission not found' 
            });
            return;
        }

        // Get modules that this role has read permission for
        const { data: modules, error: modulesError } = await supabase
            .from('role_module_permissions')
            .select(`
                modules (
                    id,
                    name,
                    slug
                )
            `)
            .eq('role_id', role_id)
            .eq('permission_id', readPermission.id);

        if (modulesError) {
            res.status(500).json({ 
                success: false, 
                message: 'Error fetching modules', 
                error: modulesError.message 
            });
            return;
        }

        // Transform the data to match the expected format
        const formattedModules = modules.map((item: any) => item.modules);

        res.json({ 
            success: true, 
            data: formattedModules 
        });
    } catch (err: any) {
        res.status(500).json({ 
            success: false, 
            message: 'Error fetching sidebar modules', 
            error: err.message 
        });
    }
}; 