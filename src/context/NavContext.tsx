import React, { createContext, ReactNode, useState } from 'react';

import { Nav } from '../types';
interface NavContextValue {
  nav: Nav;
  setNav: React.Dispatch<React.SetStateAction<Nav>>;
}
// Create the context with an initial value
const NavContext = createContext<NavContextValue | undefined>(undefined);
interface NavContextProviderProps {
  children: ReactNode;
}
function NavContextProvider({ children }: NavContextProviderProps) {
  const [nav, setNav] = useState<Nav>(Nav.Home);
  const value = { nav, setNav };
  return <NavContext.Provider value={value}>{children}</NavContext.Provider>;
}
function useNav() {
  const context = React.useContext(NavContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}
export { NavContextProvider, useNav };
