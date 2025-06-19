import { Router, Request, Response, NextFunction } from 'express';
import {
  getRoles,
  getPermissions,
  getModules,
  getRolePermissions,
  createRole,
} from '../controllers/rolePermissionController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/roles', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getRoles);
router.get('/permissions', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getPermissions);
router.get('/modules', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getModules); // TODO: Move this to its own controller and route, with its own module
router.get('/role-permissions/:roleId', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getRolePermissions);
router.post('/roles', auth, checkPermission({ module: 'roles_list', permission: 'create' }), createRole);

export default router; 
