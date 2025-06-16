import { Router } from 'express';
import { getSidebarModules } from '../controllers/sidebarController';
import { auth } from '../middleware/auth';

const router = Router();

// Get modules for sidebar
router.get('/modules', auth, getSidebarModules);

export default router; 