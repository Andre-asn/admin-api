import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';
import bcrypt from 'bcryptjs';

export const getPatients = async (_req: Request, res: Response): Promise<void> => {
    try {
        const { data: patients, error } = await supabase
            .from('users')
            .select('id,email,first_name,last_name,dob,created_at,updated_at,gender')
            .eq('role_id', 1);
        if (error) {
            res.status(500).json({ success: false, message: 'Error fetching patients', error: error.message });
            return;
        }
        res.json({ success: true, data: patients });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error fetching patients', error: err.message });
    }
};

export const getPatientById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { data: patient, error } = await supabase
            .from('users')
            .select('id,email,first_name,last_name,dob,created_at,updated_at,gender')
            .eq('id', id)
            .eq('role_id', 1)
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error fetching patient', error: error.message });
            return;
        }
        if (!patient) {
            res.status(404).json({ success: false, message: `No patient found with ID: ${id}` });
            return;
        }
        res.json({ success: true, data: patient });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error fetching patient', error: err.message });
    }
};

export const createPatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, first_name, last_name, gender, dob} = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const { data: patient, error } = await supabase
            .from('users')
            .insert([{
                email,
                password: hashedPassword,
                first_name,
                last_name,
                gender,
                dob,
                role_id: 1
            }])
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error creating patient', error: error.message });
            return;
        } 
        res.status(201).json({ success: true, data: {...patient, password: undefined} });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error creating patient', error: err.message });
    }
};

export const updatePatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, gender, dob, address } = req.body;
        const { data: patient, error } = await supabase
            .from('users')
            .update({
                first_name: firstName,
                last_name: lastName,
                email,
                gender,
                dob,
                address
            })
            .eq('id', id)
            .eq('role_id', 1)
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error updating patient', error: error.message });
            return;
        }
        res.json({ success: true, data: {...patient, password: undefined} });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error updating patient', error: err.message });
    }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // First check if the user exists and is a patient
        const { data: patient, error: fetchError } = await supabase
            .from('users')
            .select('role_id')
            .eq('id', id)
            .single();

        if (fetchError) {
            res.status(404).json({ success: false, message: 'Patient not found' });
            return;
        }

        if (patient.role_id !== 1) {
            res.status(403).json({ 
                success: false, 
                message: 'Cannot deactivate this account as it is not a patient account' 
            });
            return;
        }

        // If we get here, we know it's a patient account, proceed with deactivation
        const { error } = await supabase
            .from('users')
            .update({ status: 'inactive' })
            .eq('id', id)
            .eq('role_id', 1);

        if (error) {
            res.status(500).json({ success: false, message: 'Error deactivating patient', error: error.message });
            return;
        }

        res.json({ success: true, message: `Patient ${id} has been deactivated.` });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error deactivating patient', error: err.message });
    }
}; 