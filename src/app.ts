import express, { Express, Request, Response } from 'express';
import doctorRoutes from './routes/doctorRoutes';

const app: Express = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome message (like a restaurant greeter)
app.get('/', (req: Request, res: Response) => {
    res.json({
      message: 'Welcome to the Doctor API!',
      description: 'Healthcare provider management system',
      status: 'Active',
      availableEndpoints: {
        welcome: 'GET / - This welcome message',
        allDoctors: 'GET /api/doctors - Get all doctors',
        oneDoctor: 'GET /api/doctors/:id - Get specific doctor by ID'
      },
      examples: [
        'Try: GET /api/doctors',
        'Try: GET /api/doctors/1',
        'Try: GET /api/doctors/2'
      ]
    });
  });

app.use('/api/doctors', doctorRoutes);

app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Oops! "${req.originalUrl}" is not a valid route`,
        suggestion: 'Try /api/doctors instead!',
        availableRoutes: [
            'GET /',
            'GET /api/doctors', 
            'GET /api/doctors/:id'
        ]
    });
});

export default app;