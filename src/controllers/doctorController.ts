import { Request, Response } from 'express';
import { mockDoctors } from '../data/mockDoctors';
import { Doctor } from '../types/doctor';

export const getDoctors = (req: Request, res: Response): void => {
    try {
        console.log('Readying list of doctors...');

        res.json({
            success: true,
            message: 'Doctors fetched successfully',
            count: mockDoctors.length,
            data: mockDoctors
        });
        console.log(`Successfully listed ${mockDoctors.length} doctors`);

    } catch (error) {
        console.error('Whoops! Cant retrieve doctors right now :( ', error);
        res.status(500).json({
            success: false,
            message: 'Please try again later'
        })
    }
}


export const getDoctorById = (req: Request, res: Response): void => {

    try {
        const { id } = req.params;
        console.log(`Looking for doctor with ID: ${id}`);

        const doctor: Doctor | undefined = mockDoctors.find(doc => doc.id === id);

        if (doctor) {
            console.log(`Found Dr. ${doctor.firstName} ${doctor.lastName} with ID: ${id}`);
            res.json({
                success: true,
                message: `Found Dr. ${doctor.firstName} ${doctor.lastName} with ID: ${id}`,
                data: doctor
            })
        } else {
            console.log(`No doctor found with ID: ${id}`);
            res.status(404).json({
                success: false,
                message: `No doctor found with ID: ${id}`
            })
        }
    } catch (error) {
        console.error(`Whoops! Error fetching doctor with that ID`, error);
        res.status(500).json({
            success: false,
            message: 'Please try again later'
        })
    }
}

