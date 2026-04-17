import { Ban, Eye, Edit, CheckSquare, Award } from 'lucide-react';
import { PermissionLevel } from './types';

export const PERMISSION_LEVELS: PermissionLevel[] = [
  { level: 0, label: 'No Access', icon: Ban, color: '#94A3B8', bg: '#F1F5F9' },
  { level: 1, label: 'Viewer', icon: Eye, color: '#3B82F6', bg: '#EFF6FF' },
  { level: 2, label: 'Editor', icon: Edit, color: '#F59E0B', bg: '#FFFBEB' },
  { level: 3, label: 'Verifier', icon: CheckSquare, color: '#8B5CF6', bg: '#F5F3FF' },
  { level: 4, label: 'Approver', icon: Award, color: '#10B981', bg: '#ECFDF5' },
];
