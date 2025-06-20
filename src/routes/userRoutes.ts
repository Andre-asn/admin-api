import { Router } from 'express';
import { createUser, getUsers, getUserById, updateUser } from '../controllers/userController';
import { checkPermission } from '../middleware/checkPermission';
import { auth } from '../middleware/auth';

const router = Router();

// Create a new user (requires 'create' permission on 'role_permissions' module)
router.post('/', auth, checkPermission({ module: 'users_list', permission: 'create' }), createUser);
router.get('/', auth, checkPermission({ module: 'users_list', permission: 'read' }), getUsers);
router.get('/:id', auth, checkPermission({ module: 'users_list', permission: 'read' }), getUserById);
router.put('/:id', auth, checkPermission({ module: 'users_list', permission: 'update' }), updateUser);

export default router; 