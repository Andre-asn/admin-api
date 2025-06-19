import express, { Express, Request, Response } from 'express';
import doctorRoutes from './routes/doctorRoutes';
import authRoutes from './routes/authRoutes';
import rolePermissionRoutes from './routes/rolePermissionRoutes';
import patientRoutes from './routes/patientRoutes';
import sidebarRoutes from './routes/sidebarRoutes';
import userRoutes from './routes/userRoutes';

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
        createDoctors: 'POST /api/doctors - Create a new doctor',
        oneDoctor: 'GET /api/doctors/:id - Get specific doctor by ID',
        auth: {
          login: 'POST /api/auth/login',
          me: 'GET /api/auth/me'
        }
      },
      examples: [
        'Try: GET /api/doctors',
        'Try: GET /api/doctors/1',
        'Try: POST /api/auth/login'
      ]
    });
  });
  
app.use('/api', rolePermissionRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/users', userRoutes);
app.use('/api/sidebar', sidebarRoutes);

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