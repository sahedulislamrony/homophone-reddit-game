/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState } from 'react';
import { Page, RouterContextType } from '@shared/types/router';

const RouterContext = createContext<RouterContextType | undefined>(undefined);

interface RouterProviderProps {
  children: React.ReactNode;
  initialPage?: Page;
}

export function RouterProvider({ children, initialPage = 'home' }: RouterProviderProps) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);

  const goto = (page: Page) => {
    setCurrentPage(page);
  };

  return <RouterContext.Provider value={{ currentPage, goto }}>{children}</RouterContext.Provider>;
}

export function useRouter(): RouterContextType {
  const context = useContext(RouterContext);
  if (context === undefined) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
}
