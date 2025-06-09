import { Router } from 'express';
import { getDoctors, getDoctorById, onboardDoctor, deleteDoctor } from '../controllers/doctorController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/', auth, checkPermission({ module: 'doctors_list', permission: 'read' }), getDoctors);
router.get('/:id', auth, checkPermission({ module: 'doctors_list', permission: 'read' }), getDoctorById);
// router.post('/', auth, createDoctor); // Upgrade patient to doctor (disabled for now)
router.post('/onboard', onboardDoctor);
router.delete('/:id', auth, checkPermission({ module: 'doctors_list', permission: 'delete' }), deleteDoctor);

export default router;