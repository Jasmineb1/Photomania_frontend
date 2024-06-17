import { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { useModal } from '../context/ModalContext';

const SignupModal = ({ children }: { children: ReactNode }) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const { setModal } = useModal();

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      setModal(null);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      setModal(null);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="bg-white-50 mx-50 my-0 w-screen dark:bg-gray-900">
        {children}
      </div>
    </div>,
    document.getElementById('backdrop')!
  );
};

export default SignupModal;
