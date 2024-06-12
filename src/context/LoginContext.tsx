import React, { createContext, ReactNode, useState } from 'react';

interface LoginContextValue {
  login: boolean;
  setLogin: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create the context with an initial value
const LoginContext = createContext<LoginContextValue | undefined>(undefined);
interface LoginContextProviderProps {
  children: ReactNode;
}
function LoginContextProvider({ children }: LoginContextProviderProps) {
  const [login, setLogin] = useState<boolean>(false);
  const value = { login, setLogin };
  return <LoginContext.Provider value={value}>{children}</LoginContext.Provider>;
}
function useLogin() {
  const context = React.useContext(LoginContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}
export { LoginContextProvider as LoginContextProvider, useLogin };
