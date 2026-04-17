import React from 'react';
import { Settings2, Lock, ChevronDown } from 'lucide-react';
import { MENU_ITEMS } from '../../config/menu';
import { User } from './types';
import { PERMISSION_LEVELS } from './constants';

interface Props {
  viewMode: 'list' | 'matrix';
  users: User[];
  matrixPermissions: Record<number, Record<string, number[]>>;
  confidentialityMap: Record<string, boolean>;
  expandedModules: Record<string, boolean>;
  toggleExpand: (id: string) => void;
  handleEditUser: (user: User) => void;
}

const OperationalRightsStep: React.FC<Props> = ({ 
  viewMode, users, matrixPermissions, confidentialityMap, expandedModules, toggleExpand, handleEditUser 
}) => {
  if (viewMode === 'list') {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
        <div className="overflow-auto flex-1">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="text-xs uppercase tracking-wider text-gray-500 p-4 pl-6 font-bold bg-gray-50 border-b border-gray-200">User</th>
                <th className="text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200">Position</th>
                <th className="text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200">Email</th>
                <th className="text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200 text-center">Role Type</th>
                <th className="text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-600">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-0">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <img src={user.avatar} className="w-10 h-10 rounded-full border border-gray-200 object-cover" alt={user.name} />
                      <div>
                        <div className="font-bold text-gray-900">{user.name}</div>
                        <div className="text-xs text-gray-500">ID: {user.id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-900 font-medium">{user.position}</td>
                  <td className="p-4 text-xs">{user.email}</td>
                  <td className="p-4 text-center">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${user.isDev ? 'bg-[#F9F7F6] text-[#E3624A]' : 'bg-gray-100 text-gray-600'}`}>
                      {user.isDev ? 'Developer' : 'Standard User'}
                    </span>
                  </td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => handleEditUser(user)}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold text-gray-700 hover:bg-gray-50 transition-all shadow-sm"
                    >
                      <Settings2 size={14} /> Permissions
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col h-full">
      <div className="overflow-auto flex-1">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="sticky left-0 z-20 min-w-[200px] text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)]">Module / User</th>
              {users.map(user => (
                <th key={user.id} className="text-center min-w-[100px] text-xs uppercase tracking-wider text-gray-500 p-4 font-bold bg-gray-50 border-b border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => handleEditUser(user)}>
                  <div className="flex flex-col items-center gap-2 group">
                    <img src={user.avatar} className="w-8 h-8 rounded-full border border-white shadow-sm group-hover:scale-110 transition-transform" alt={user.name} />
                    <span className="text-[10px] font-bold text-gray-900 whitespace-nowrap group-hover:text-[#111f42]">{user.name.split(' ')[0]}</span>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-sm text-gray-600">
            {MENU_ITEMS.map(module => {
              const isExpanded = expandedModules[module.id];
              const hasSub = module.subItems && module.subItems.length > 0;
              return (
                <React.Fragment key={module.id}>
                  <tr className="bg-gray-50/50 hover:bg-gray-100 transition-colors">
                    <td className="sticky left-0 z-10 bg-gray-50 p-3 font-bold text-gray-900 border-b border-gray-200 shadow-[2px_0_5px_rgba(0,0,0,0.05)] cursor-pointer select-none" onClick={() => hasSub && toggleExpand(module.id)}>
                      <div className="flex items-center gap-2">
                        <module.icon size={16} className={confidentialityMap[module.id] ? "text-red-500" : "text-[#111f42]"} />
                        {module.name}
                        {confidentialityMap[module.id] && <Lock size={12} className="text-red-500" />}
                        {hasSub && <ChevronDown size={14} className={`ml-auto text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />}
                      </div>
                    </td>
                    {users.map(user => {
                      const levels = matrixPermissions[user.id]?.[module.id] || [];
                      return (
                        <td key={user.id} className="text-center border-b border-gray-200 p-2">
                          <div className="flex justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                            {levels.map(lvl => {
                              const pInfo = PERMISSION_LEVELS.find(p => p.level === lvl);
                              if(!pInfo) return null;
                              return <div key={lvl} className="inline-flex items-center justify-center w-6 h-6 rounded shadow-sm" style={{ backgroundColor: pInfo.bg }} title={pInfo.label}><pInfo.icon size={12} style={{color: pInfo.color}} /></div>;
                            })}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                  {hasSub && isExpanded && module.subItems?.map(sub => (
                    <tr key={sub.id} className="hover:bg-gray-50 transition-colors bg-white">
                      <td className="sticky left-0 z-10 bg-white p-3 pl-10 border-b border-gray-100 shadow-[2px_0_5px_rgba(0,0,0,0.05)] flex items-center gap-2">
                        {sub.name}
                        {confidentialityMap[sub.id] && <Lock size={12} className="text-red-500" />}
                      </td>
                      {users.map(user => {
                        const levels = matrixPermissions[user.id]?.[sub.id] || [];
                        return (
                          <td key={user.id} className="text-center border-b border-gray-100 p-2">
                            <div className="flex justify-center gap-1 flex-wrap max-w-[120px] mx-auto">
                              {levels.map(lvl => {
                                const pInfo = PERMISSION_LEVELS.find(p => p.level === lvl);
                                if(!pInfo) return null;
                                return <div key={lvl} className="inline-flex items-center justify-center w-6 h-6 rounded shadow-sm" style={{ backgroundColor: pInfo.bg }} title={pInfo.label}><pInfo.icon size={12} style={{color: pInfo.color}} /></div>;
                              })}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OperationalRightsStep;
