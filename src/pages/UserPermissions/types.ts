import { LucideIcon } from 'lucide-react';

export interface PermissionLevel {
  level: number;
  label: string;
  icon: LucideIcon;
  color: string;
  bg: string;
}

export interface User {
  id: number;
  name: string;
  position: string;
  email: string;
  avatar: string;
  isDev?: boolean;
  permissions?: string; // JSON string from DB
}
