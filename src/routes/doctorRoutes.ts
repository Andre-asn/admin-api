import { Router } from 'express';
import { getDoctors, getDoctorById, createDoctor, onboardDoctor } from '../controllers/doctorController';

const router = Router();

router.get('/', getDoctors);
router.get('/:id', getDoctorById);
router.post('/', createDoctor);
router.post('/onboard', onboardDoctor);

export default router;