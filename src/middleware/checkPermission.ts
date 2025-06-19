import { Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';
import { IGetUserAuthInfoRequest } from '../types/express/IGetUserAuthInfoRequest';

// Define permission types for type safety
export type PermissionType = 'create' | 'read' | 'update' | 'delete';
export type ModuleType = 'doctors_list' | 'patients_list' | 'users_list' | 'roles_list';

interface CheckPermissionOptions {
  module: ModuleType;
  permission: PermissionType;
}

/**
 * Middleware to check if a user has the required permission for a specific module
 * @param options Object containing module and permission to check
 * @returns Middleware function
 */
export const checkPermission = (options: CheckPermissionOptions) => {
  return async (req: IGetUserAuthInfoRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const { role_id } = req.user;
      const { module, permission } = options;

      // Get the module and permission from the database
      const [moduleResult, permissionResult] = await Promise.all([
        supabase.from('modules').select('id').eq('name', module).single(),
        supabase.from('permissions').select('id').eq('name', permission).single()
      ]);

      // Check if module and permission exist
      if (moduleResult.error || permissionResult.error) {
        res.status(500).json({
          success: false,
          message: 'Module or permission not found'
        });
        return;
      }

      // Check if the user's role has the required permission for the module
      const { data: rolePermission, error: rolePermissionError } = await supabase
        .from('role_module_permissions')
        .select('*')
        .eq('role_id', role_id)
        .eq('module_id', moduleResult.data.id)
        .eq('permission_id', permissionResult.data.id)
        .single();

      // If no permission found or error occurred, return 403 Forbidden
      if (rolePermissionError || !rolePermission) {
        res.status(403).json({
          success: false,
          message: `Forbidden: You don't have ${permission} permissions for that!`
        });
        return;
      }

      // If permission exists, proceed to the next middleware/controller
      next();
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({
        success: false,
        message: 'Internal server error while checking permissions'
      });
      return;
    }
  };
};

/**
 * Helper function to check if a user has a specific permission
 * Useful for filtering responses in controllers
 */
export const hasPermission = async (
  roleId: number,
  module: ModuleType,
  permission: PermissionType
): Promise<boolean> => {
  try {
    const [moduleResult, permissionResult] = await Promise.all([
      supabase.from('modules').select('id').eq('name', module).single(),
      supabase.from('permissions').select('id').eq('name', permission).single()
    ]);

    if (moduleResult.error || permissionResult.error) {
      return false;
    }

    const { data: rolePermission, error: rolePermissionError } = await supabase
      .from('role_module_permissions')
      .select('*')
      .eq('role_id', roleId)
      .eq('module_id', moduleResult.data.id)
      .eq('permission_id', permissionResult.data.id)
      .single();

    return !rolePermissionError && !!rolePermission;
  } catch (error) {
    console.error('Permission check error:', error);
    return false;
  }
}; 