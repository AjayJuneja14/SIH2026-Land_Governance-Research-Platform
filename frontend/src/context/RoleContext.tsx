'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserRole } from '@/types';

interface RoleContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  rolePermissions: {
    canRunSimulation: boolean;
    canCreateProject: boolean;
    canAccessAdmin: boolean;
    canViewInternalDatasets: boolean;
  };
}

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('Researcher');

  useEffect(() => {
    const saved = localStorage.getItem('landgov_pune_role');
    if (saved) {
      setRoleState(saved as UserRole);
    }
  }, []);

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    localStorage.setItem('landgov_pune_role', newRole);
  };

  const rolePermissions = {
    canRunSimulation: ['Researcher', 'Government Official', 'Policymaker', 'Administrator'].includes(role),
    canCreateProject: ['Researcher', 'Academic', 'Government Official', 'Policymaker', 'Administrator'].includes(role),
    canAccessAdmin: ['Administrator', 'Government Official'].includes(role),
    canViewInternalDatasets: ['Researcher', 'Government Official', 'Policymaker', 'Administrator'].includes(role),
  };

  return (
    <RoleContext.Provider value={{ role, setRole, rolePermissions }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = (): RoleContextType => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};