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
import { isAdmin } from '../middleware/isAdmin';

const router = Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: Request, res: Response, next: NextFunction) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get('/roles', auth, isAdmin, asyncHandler(getRoles));
router.get('/permissions', auth, isAdmin, asyncHandler(getPermissions));
router.get('/modules', auth, isAdmin, asyncHandler(getModules));
router.get('/role-permissions/:roleId', auth, isAdmin, asyncHandler(getRolePermissions));
router.post('/role-permissions', auth, isAdmin, asyncHandler(assignRolePermission));
router.delete('/role-permissions', auth, isAdmin, asyncHandler(removeRolePermission));

export default router; 