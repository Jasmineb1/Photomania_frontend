import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

const SignupModal = ({ children }: { children: ReactNode }) => {
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div>{children}</div>
    </div>,
    document.getElementById('backdrop')!
  );
};

export default SignupModal;
