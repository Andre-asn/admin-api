import { Router } from 'express';
import { getDoctors, getDoctorById, onboardDoctor, deactivateDoctor } from '../controllers/doctorController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/', auth, checkPermission({ module: 'doctors_list', permission: 'read' }), getDoctors);
router.get('/:id', auth, checkPermission({ module: 'doctors_list', permission: 'read' }), getDoctorById);
// router.post('/', auth, createDoctor); // Upgrade patient to doctor (disabled for now)
router.post('/onboard', auth, checkPermission({ module: 'doctors_list', permission: 'create' }), onboardDoctor);
router.put('/:id/deactivate', auth, checkPermission({ module: 'doctors_list', permission: 'update' }), deactivateDoctor);

export default router;