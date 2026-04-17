import { 
  Home,
  CalendarClock,
  ClipboardList,
  AlertTriangle,
  Factory,
  Settings2,
  UserCog
} from 'lucide-react';

export interface MenuItem {
  id: string;
  path: string;
  name: string;
  icon: any;
  isConfidential: boolean;
  subItems?: { id: string; name: string; path: string; isConfidential?: boolean }[];
}

export const MENU_ITEMS: MenuItem[] = [
  { id: 'home', path: '/', name: 'HOME', icon: Home, isConfidential: false },
  { id: 'planning', path: '/planning', name: 'PLANNING', icon: CalendarClock, isConfidential: false, subItems: [
      { id: 'plan_fr_planning', name: 'PLAN FR PLANNING', path: '/planning/fr' },
      { id: 'plan_by_prod', name: 'PLAN BY PRODUCTION', path: '/planning/prod' }
  ]},
  { id: 'daily_board', path: '/daily-board', name: 'DAILY BOARD', icon: ClipboardList, isConfidential: false, subItems: [
      { id: 'prod_tracking', name: 'PRODUCTION TRACKING', path: '/daily-board/tracking' },
      { id: 'mixing_plan', name: 'MIXING PLAN', path: '/daily-board/mixing' },
      { id: 'packing_plan', name: 'PACKING PLAN', path: '/daily-board/packing' }
  ]},
  { id: 'daily_problem', path: '/daily-problem', name: 'DAILY PROBLEM', icon: AlertTriangle, isConfidential: false, subItems: [
      { id: 'unplanned_jobs', name: 'UNPLANNED JOBS', path: '/daily-problem/unplanned' },
      { id: 'machine_breakdown', name: 'MACHINE BREAKDOWN', path: '/daily-problem/machine' }
  ]},
  { id: 'process', path: '/process', name: 'PROCESS', icon: Factory, isConfidential: false, subItems: [
      { id: 'premix', name: 'PREMIX', path: '/process/premix' },
      { id: 'mixing', name: 'MIXING', path: '/process/mixing' },
      { id: 'forming', name: 'FORMING', path: '/process/forming' },
      { id: 'cooking', name: 'COOKING', path: '/process/cooking' },
      { id: 'cooling', name: 'COOLING', path: '/process/cooling' },
      { id: 'cut_peel', name: 'CUT & PEEL', path: '/process/cut-peel' },
      { id: 'packing', name: 'PACKING', path: '/process/packing' }
  ]},
  { id: 'prod_config', path: '/prod-config', name: 'PROD CONFIG', icon: Settings2, isConfidential: true, subItems: [
      { id: 'master_item', name: 'MASTER ITEM', path: '/prod-config/master-item' },
      { id: 'std_process', name: 'STD PROCESS', path: '/prod-config/std-process' },
      { id: 'product_matrix', name: 'PRODUCT MATRIX', path: '/prod-config/product-matrix' },
      { id: 'equipment_registry', name: 'EQUIPMENT REG', path: '/prod-config/equipment-registry' },
      { id: 'meat_formula', name: 'MEAT FORMULAR', path: '/prod-config/formula' },
      { id: 'config', name: 'CONFIG', path: '/prod-config/settings' }
  ]},
  { id: 'setting', path: '/permissions', name: 'SETTING', icon: UserCog, isConfidential: true, subItems: [
      { id: 'user_setting', name: 'USER SETTING', path: '/permissions' }
  ]}
];
