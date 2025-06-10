import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

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
            .select('*')
            .eq('user_id', id)
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
        const { firstName, lastName, email, gender, dob, address } = req.body;
        const { data: patient, error } = await supabase
            .from('users')
            .insert([{
                first_name: firstName,
                last_name: lastName,
                email,
                gender,
                dob,
                address,
                role_id: 1
            }])
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error creating patient', error: error.message });
            return;
        }
        res.status(201).json({ success: true, data: patient });
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
            .eq('user_id', id)
            .eq('role_id', 1)
            .select()
            .single();
        if (error) {
            res.status(500).json({ success: false, message: 'Error updating patient', error: error.message });
            return;
        }
        res.json({ success: true, data: patient });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error updating patient', error: err.message });
    }
};

export const deletePatient = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { error } = await supabase
            .from('users')
            .delete()
            .eq('user_id', id)
            .eq('role_id', 1);
        if (error) {
            res.status(500).json({ success: false, message: 'Error deleting patient', error: error.message });
            return;
        }
        res.json({ success: true, message: `Patient ${id} deleted.` });
    } catch (err: any) {
        res.status(500).json({ success: false, message: 'Error deleting patient', error: err.message });
    }
}; 