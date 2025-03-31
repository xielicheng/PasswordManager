import React, { createContext, useContext, useState, useCallback } from 'react';
import { databaseService, Password } from '../services/DatabaseService';

interface PasswordContextType {
  passwords: Password[];
  filteredPasswords: Password[];
  isLoading: boolean;
  addPassword: (password: Omit<Password, 'id' | 'createdAt'>) => Promise<void>;
  deletePassword: (id: number) => Promise<void>;
  updatePassword: (id: number, password: Omit<Password, 'id' | 'createdAt'>) => Promise<void>;
  refreshPasswords: () => Promise<void>;
  searchPasswords: (query: string) => void;
  clearSearch: () => void;
}

const PasswordContext = createContext<PasswordContextType | undefined>(undefined);

export function PasswordProvider({ children }: { children: React.ReactNode }) {
  const [passwords, setPasswords] = useState<Password[]>([]);
  const [filteredPasswords, setFilteredPasswords] = useState<Password[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const refreshPasswords = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await databaseService.getAllPasswords();
      setPasswords(result);
      setFilteredPasswords(result);
    } catch (error) {
      console.error('加载密码失败:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const searchPasswords = (query: string) => {
    const searchQuery = query.toLowerCase();
    const filtered = passwords.filter(password => 
      password.name.toLowerCase().includes(searchQuery)
    );
    setFilteredPasswords(filtered);
  };

  const clearSearch = () => {
    setFilteredPasswords(passwords);
  };

  const addPassword = async (password: Omit<Password, 'id' | 'createdAt'>) => {
    try {
      await databaseService.addPassword(password);
      await refreshPasswords();
    } catch (error) {
      console.error('添加密码失败:', error);
      throw error;
    }
  };

  const deletePassword = async (id: number) => {
    try {
      await databaseService.deletePassword(id);
      await refreshPasswords();
    } catch (error) {
      console.error('删除密码失败:', error);
      throw error;
    }
  };

  const updatePassword = async (id: number, password: Omit<Password, 'id' | 'createdAt'>) => {
    try {
      await databaseService.updatePassword(id, password);
      await refreshPasswords();
    } catch (error) {
      console.error('更新密码失败:', error);
      throw error;
    }
  };

  return (
    <PasswordContext.Provider
      value={{
        passwords,
        filteredPasswords,
        isLoading,
        addPassword,
        deletePassword,
        updatePassword,
        refreshPasswords,
        searchPasswords,
        clearSearch,
      }}
    >
      {children}
    </PasswordContext.Provider>
  );
}

export function usePasswordContext() {
  const context = useContext(PasswordContext);
  if (context === undefined) {
    throw new Error('usePasswordContext must be used within a PasswordProvider');
  }
  return context;
} 