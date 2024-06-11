import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const SignupModal = ({ children }: { children: ReactNode }) => {
  return createPortal(<div>{children}</div>, document.getElementById('root')!);
};

export default SignupModal;
