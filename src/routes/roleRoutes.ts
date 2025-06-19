import { Router } from 'express';
import {
  getRoles,
  getRolePermissions,
  createRole,
  updateRole,
  deleteRole,
} from '../controllers/roleController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getRoles);
router.get('/role-permissions/:roleId', auth, checkPermission({ module: 'roles_list', permission: 'read' }), getRolePermissions);
router.post('/', auth, checkPermission({ module: 'roles_list', permission: 'create' }), createRole);
router.put('/:roleId', auth, checkPermission({ module: 'roles_list', permission: 'update' }), updateRole);
router.delete('/:roleId', auth, checkPermission({ module: 'roles_list', permission: 'delete' }), deleteRole);

export default router; 
