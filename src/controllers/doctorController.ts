import { Request, Response } from 'express';
import { supabase } from '../utils/supabase';

export const getDoctors = async (_req: Request, res: Response): Promise<void> => {
    try {
        console.log('Fetching doctors from database...');

        const { data: doctors, error } = await supabase
            .from('doctors')
            .select(`
                *,
                users:user_id (
                    first_name,
                    last_name,
                    email
                ),
                doctor_addresses (
                    address,
                    city,
                    state,
                    country,
                    postal_code
                ),
                approvals (
                    status,
                    reviewed_by,
                    reviewed_at,
                    comments
                )
            `);

        if (error) {
            console.error('Database error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching doctors from database'
            });
            return;
        }

        // Transform the data to match our API response format
        const formattedDoctors = doctors.map(doctor => ({
            id: doctor.doctor_id,
            userId: doctor.user_id,
            specialization: doctor.specialization,
            licenseNumber: doctor.license_number,
            yearsOfExperience: doctor.years_of_experience,
            institution: doctor.institution,
            degree: doctor.degree,
            yearsOfEducation: doctor.years_of_education,
            status: doctor.status,
            createdAt: doctor.created_at,
            updatedAt: doctor.updated_at,
            // Joined data
            firstName: doctor.users?.first_name,
            lastName: doctor.users?.last_name,
            email: doctor.users?.email,
            address: doctor.doctor_addresses?.[0],
            approval: doctor.approvals?.[0]
        }));

        res.json({
            success: true,
            message: 'Doctors fetched successfully',
            count: formattedDoctors.length,
            data: formattedDoctors
        });
        console.log(`Successfully fetched ${formattedDoctors.length} doctors`);

    } catch (error) {
        console.error('Error in getDoctors:', error);
        res.status(500).json({
            success: false,
            message: 'Please try again later'
        });
    }
};

export const getDoctorById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        console.log(`Looking for doctor with ID: ${id}`);

        const { data: doctor, error } = await supabase
            .from('doctors')
            .select(`
                *,
                users:user_id (
                    first_name,
                    last_name,
                    email
                ),
                doctor_addresses (
                    address,
                    city,
                    state,
                    country,
                    postal_code
                ),
                approvals (
                    status,
                    reviewed_by,
                    reviewed_at,
                    comments
                )
            `)
            .eq('doctor_id', id)
            .single();

        if (error) {
            console.error('Database error:', error);
            res.status(500).json({
                success: false,
                message: 'Error fetching doctor from database'
            });
            return;
        }

        if (!doctor) {
            console.log(`No doctor found with ID: ${id}`);
            res.status(404).json({
                success: false,
                message: `No doctor found with ID: ${id}`
            });
            return;
        }

        // Transform the data to match our API response format
        const formattedDoctor = {
            id: doctor.doctor_id,
            userId: doctor.user_id,
            specialization: doctor.specialization,
            licenseNumber: doctor.license_number,
            yearsOfExperience: doctor.years_of_experience,
            institution: doctor.institution,
            degree: doctor.degree,
            yearsOfEducation: doctor.years_of_education,
            status: doctor.status,
            createdAt: doctor.created_at,
            updatedAt: doctor.updated_at,
            // Joined data
            firstName: doctor.users?.first_name,
            lastName: doctor.users?.last_name,
            email: doctor.users?.email,
            address: doctor.doctor_addresses?.[0],
            approval: doctor.approvals?.[0]
        };

        console.log(`Found doctor: ${formattedDoctor.firstName} ${formattedDoctor.lastName}`);
        res.json({
            success: true,
            message: `Found Dr. ${formattedDoctor.firstName} ${formattedDoctor.lastName}`,
            data: formattedDoctor
        });

    } catch (error) {
        console.error(`Error fetching doctor with ID ${req.params.id}:`, error);
        res.status(500).json({
            success: false,
            message: 'Please try again later'
        });
    }
};

export const createDoctor = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            userId,
            specialization,
            licenseNumber,
            yearsOfExperience,
            institution,
            degree,
            yearsOfEducation,
            address
        } = req.body;

        // First, create the doctor record
        const { data: doctor, error: doctorError } = await supabase
            .from('doctors')
            .insert([{
                user_id: userId,
                specialization,
                license_number: licenseNumber,
                years_of_exp: yearsOfExperience,
                institution,
                degree,
                years_of_edu: yearsOfEducation,
                status: 'pending'  // New doctors start as pending
            }])
            .select()
            .single();
        
        if (doctorError) {
            console.error('Error creating doctor:', doctorError);
            res.status(500).json({
                success: false,
                message: 'Error creating doctor record'
            });
            return;
        }

        // If address is provided, create the address record
        if (address) {
            const { error: addressError } = await supabase
                .from('doctor_addresses')
                .insert([{
                    doctor_id: doctor.doctor_id,
                    address: address.address,
                    city: address.city,
                    state: address.state,
                    country: address.country,
                    postal_code: address.postalCode
                }]);

            if (addressError) {
                console.error('Error creating address:', addressError);
                // Note: We don't return here, as the doctor was created successfully
            }
        }

        // Create initial approval record
        const { error: approvalError } = await supabase
            .from('approvals')
            .insert([{
                doctor_id: doctor.doctor_id,
                status: 'pending'
            }]);

        if (approvalError) {
            console.error('Error creating approval record:', approvalError);
            // Note: We don't return here, as the doctor was created successfully
        }

        // Fetch the complete doctor record with all relations
        const { data: completeDoctor, error: fetchError } = await supabase
            .from('doctors')
            .select(`
                *,
                users:user_id (
                    first_name,
                    last_name,
                    email
                ),
                doctor_addresses (
                    address,
                    city,
                    state,
                    country,
                    postal_code
                ),
                approvals (
                    status,
                    reviewed_by,
                    reviewed_at,
                    comments
                )
            `)
            .eq('doctor_id', doctor.doctor_id)
            .single();

        if (fetchError) {
            console.error('Error fetching complete doctor record:', fetchError);
            res.status(500).json({
                success: false,
                message: 'Doctor created but error fetching complete record'
            });
            return;
        }

        // Transform the data to match our API response format
        const formattedDoctor = {
            id: completeDoctor.doctor_id,
            userId: completeDoctor.user_id,
            specialization: completeDoctor.specialization,
            licenseNumber: completeDoctor.license_number,
            yearsOfExperience: completeDoctor.years_of_experience,
            institution: completeDoctor.institution,
            degree: completeDoctor.degree,
            yearsOfEducation: completeDoctor.years_of_education,
            status: completeDoctor.status,
            createdAt: completeDoctor.created_at,
            updatedAt: completeDoctor.updated_at,
            // Joined data
            firstName: completeDoctor.users?.first_name,
            lastName: completeDoctor.users?.last_name,
            email: completeDoctor.users?.email,
            address: completeDoctor.doctor_addresses?.[0],
            approval: completeDoctor.approvals?.[0]
        };

        res.status(201).json({
            success: true,
            message: 'Doctor created successfully',
            data: formattedDoctor
        });

    } catch (error) {
        console.error('Error in createDoctor:', error);
        res.status(500).json({
            success: false,
            message: 'Error creating doctor'
        });
    }
};

export const onboardDoctor = async (req: Request, res: Response): Promise<void> => {
    const {
        email,
        password, // Not hashed yet
        firstName,
        lastName,
        gender,
        dob,
        doctorProfile
    } = req.body;

    // 1. Create user
    const { data: user, error: userError } = await supabase
        .from('users')
        .insert([{
            email,
            password, // Store as plain text for now (not secure)
            first_name: firstName,
            last_name: lastName,
            gender,
            dob,
            role: 'doctor'
        }])
        .select()
        .single();

    if (userError) {
        console.error('Error in creating user:', userError);
        res.status(400).json({ success: false, message: 'User creation failed', error: userError.message });
        return;
    }

    // 2. Create doctor profile (exclude address fields)
    const { address, ...doctorFields } = doctorProfile;
    const { data: doctor, error: doctorError } = await supabase
        .from('doctors')
        .insert([{
            ...doctorFields,
            user_id: user.id,
            status: 'pending'
        }])
        .select()
        .single();

    if (doctorError) {
        // Optionally: delete the user you just created to keep data clean
        await supabase.from('users').delete().eq('id', user.id);
        console.error('Error in creating doctor profile:', doctorError);
        res.status(400).json({ success: false, message: 'Doctor profile creation failed', error: doctorError.message });
        return;
    }

    // 3. Create doctor address if present
    let createdAddress = null;
    if (address) {
        const { data: addressData, error: addressError } = await supabase
            .from('doctor_addresses')
            .insert([{
                doctor_id: doctor.doctor_id,
                address: address.address,
                city: address.city,
                state: address.state,
                country: address.country,
                postal_code: address.postalCode
            }])
            .select()
            .single();
        if (addressError) {
            console.error('Error in adding address:', addressError);
            createdAddress = null;
        } else {
            createdAddress = addressData;
        }
    }

    // 4. Create initial approval record for the new doctor
    let approval = null;
    const { data: approvalData, error: approvalError } = await supabase
        .from('approvals')
        .insert([{
            doctor_id: doctor.doctor_id,
            status: 'pending'
        }])
        .select()
        .single();
    if (approvalError) {
        console.error('Error creating approval record:', approvalError);
    } else {
        approval = approvalData;
    }

    res.status(201).json({ success: true, user, doctor, address: createdAddress, approval });
};

