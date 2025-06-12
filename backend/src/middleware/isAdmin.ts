import { Request, Response, NextFunction } from 'express';
import { supabase } from '../utils/supabase';

export const isAdmin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = (req as any).user;
    if (!user || !user.role_id) {
      res.status(401).json({ success: false, message: 'Unauthorized' });
      return;
    }
    // Get admin role id from roles table
    const { data: adminRole, error } = await supabase
      .from('roles')
      .select('id')
      .eq('name', 'admin')
      .single();
    if (error || !adminRole) {
        res.status(500).json({ success: false, message: 'Admin role not found' });
        return;
    }
    if (user.role_id !== adminRole.id) {
      res.status(403).json({ success: false, message: 'Forbidden: Admins only' });
      return;
    }
    next();
  } catch (err) {
    next(err);
  }
}; 