import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import LoginForm from './LoginForm';
import Modal from './Modal';
import SignupForm from './SignupForm';

const Header = () => {
  const location = useLocation();
  console.warn('Location: ', location);
  console.warn('Pathname:', location.pathname);
  const { modal, setModal } = useModal();
  const { login, setLogin } = useLogin();

  const navigate = useNavigate();

  const onHomeClick = () => {
    navigate('/');
  };
  const onCreateClick = () => {
    if (!login) {
      setModal('login');
      navigate('/', { state: { from: '/post/create' } });
    } else {
      navigate('/post/create');
    }
  };

  const onLoginClick = () => {
    setModal('login');
  };

  const onLogoutClick = async () => {
    setLogin(false);

    document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;';
    sessionStorage.removeItem('token');
  };

  const onSignupClick = () => {
    setModal('signup');
  };

  return (
    <div>
      <div className="flex h-20 flex-wrap items-center justify-between bg-lilac p-3 sm:px-2 sm:py-1">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            name="button"
            onClick={onHomeClick}
            className={`text-dark hover:bg-light hover:text-dark ${location.pathname === '/' ? 'bg-purple text-light hover:text-dark' : ''} rounded-full px-4 py-3 font-semibold`}>
            Home
          </button>
          <button
            type="button"
            name="button"
            onClick={onCreateClick}
            className={`rounded-full px-5 py-3 font-semibold text-dark hover:bg-light ${location.pathname === '/post/create' ? 'bg-purple text-light hover:text-dark' : ''}`}>
            Create
          </button>
        </div>

        {login ? (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              name="button"
              className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light`}>
              Profile
            </button>
            <button
              type="button"
              name="button"
              onClick={onLogoutClick}
              className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light`}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <button
              type="button"
              name="button"
              onClick={onLoginClick}
              className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light ${modal === 'login' ? 'bg-purple text-light hover:text-dark' : ''}`}>
              Login
            </button>
            {modal === 'login' && (
              <Modal>
                <LoginForm />
              </Modal>
            )}
            <button
              type="button"
              name="button"
              onClick={onSignupClick}
              className={`font-poppins rounded-full px-5 py-3 font-semibold text-dark hover:bg-light ${modal === 'signup' ? 'bg-purple text-light hover:text-dark' : ''}`}>
              Sign Up
            </button>
            {modal === 'signup' && (
              <Modal>
                <SignupForm />
              </Modal>
            )}
          </div>
        )}
      </div>
      <Outlet />
    </div>
  );
};

export default Header;
