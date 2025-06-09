import { Router } from 'express';
import { getPatients, getPatientById, createPatient, updatePatient, deletePatient } from '../controllers/patientController';
import { auth } from '../middleware/auth';
import { checkPermission } from '../middleware/checkPermission';

const router = Router();

router.get('/', auth, checkPermission({ module: 'patients_list', permission: 'read' }), getPatients);
router.get('/:id', auth, checkPermission({ module: 'patients_list', permission: 'read' }), getPatientById);
router.post('/', auth, checkPermission({ module: 'patients_list', permission: 'create' }), createPatient);
router.put('/:id', auth, checkPermission({ module: 'patients_list', permission: 'update' }), updatePatient);
router.delete('/:id', auth, checkPermission({ module: 'patients_list', permission: 'delete' }), deletePatient);

export default router; 