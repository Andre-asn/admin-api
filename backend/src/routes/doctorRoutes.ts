import { Router } from 'express';
import { getDoctors, getDoctorById, createDoctor, onboardDoctor } from '../controllers/doctorController';
import { auth } from '../middleware/auth';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
// router.post('/', auth, createDoctor); // Upgrade patient to doctor (disabled for now)
router.post('/onboard', onboardDoctor);

export default router;