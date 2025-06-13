import { Router, Request, Response, NextFunction } from 'express';
import {
  getRoles,
  getPermissions,
  getModules,
  getRolePermissions,
  assignRolePermission,
  removeRolePermission
} from '../controllers/rolePermissionController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/roles', auth, checkPermission({ module: 'role_permissions', permission: 'read' }), getRoles);
router.get('/permissions', auth, checkPermission({ module: 'role_permissions', permission: 'read' }), getPermissions);
router.get('/modules', auth, checkPermission({ module: 'role_permissions', permission: 'read' }), getModules);
router.get('/role-permissions/:roleId', auth, checkPermission({ module: 'role_permissions', permission: 'read' }), getRolePermissions);
router.post('/role-permissions', auth, checkPermission({ module: 'role_permissions', permission: 'create' }), assignRolePermission);
router.delete('/role-permissions', auth, checkPermission({ module: 'role_permissions', permission: 'delete' }), removeRolePermission);

export default router; 
