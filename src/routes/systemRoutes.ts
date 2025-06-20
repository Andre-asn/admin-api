import { Router } from 'express';
import {
  getPermissions,
  getModules,
  createModule,
} from '../controllers/systemController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/permissions', auth, checkPermission({ module: 'system_settings', permission: 'read' }), getPermissions);
router.get('/modules', auth, checkPermission({ module: 'system_settings', permission: 'read' }), getModules); // TODO: Move this to its own controller and route, with its own module
router.post('/modules', auth, checkPermission({ module: 'system_settings', permission: 'create' }), createModule);

export default router; 
