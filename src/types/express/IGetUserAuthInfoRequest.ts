import { Request } from 'express';
import { UserRole } from '../user';

export interface IGetUserAuthInfoRequest extends Request {
  user?: {
    id: string;
    role: UserRole;
  };
} 