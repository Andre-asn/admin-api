export interface Module {
  id: number;
  name: string;
}

export interface Permission {
  id: number;
  name: string;
}

export interface UserModulePermission {
  id: number;
  userId: string; // UUID
  moduleId: number;
  permissionId: number;
}
