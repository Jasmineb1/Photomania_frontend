import React, { createContext, ReactNode, useState } from 'react';

interface ModalContextValue {
  loginModal: boolean;
  signupModal: boolean;
  setLoginModal: React.Dispatch<React.SetStateAction<boolean>>;
  setSignupModal: React.Dispatch<React.SetStateAction<boolean>>;
}
// Create the context with an initial value
const ModalContext = createContext<ModalContextValue | undefined>(undefined);
interface ModalContextProviderProps {
  children: ReactNode;
}
function ModalContextProvider({ children }: ModalContextProviderProps) {
  const [loginModal, setLoginModal] = useState<boolean>(false);
  const [signupModal, setSignupModal] = useState<boolean>(false);
  const value = { loginModal, setLoginModal, signupModal, setSignupModal };
  return <ModalContext.Provider value={value}>{children}</ModalContext.Provider>;
}
function useModal() {
  const context = React.useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useCount must be used within a CountProvider');
  }
  return context;
}
export { ModalContextProvider as ModalContextProvider, useModal };
