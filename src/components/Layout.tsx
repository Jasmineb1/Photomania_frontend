import Cookies from 'js-cookie';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import LoginForm from './LoginForm';
import Modal from './Modal';
import SignupForm from './SignupForm';

const Header = () => {
  const location = useLocation();
  const token = Cookies.get('token');

  const { modal, setModal } = useModal();
  const { login, setLogin } = useLogin();
  if (token) {
    setLogin(true);
  }
  const navigate = useNavigate();

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
    // LogOut();
    document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;';
    sessionStorage.removeItem('token');
    navigate('/');
    toast.success('Logged out!');
  };

  const onSignupClick = () => {
    setModal('signup');
  };

  return (
    <div>
      <div className="flex h-20 flex-wrap items-center justify-between bg-lilac p-3 sm:px-2 sm:py-1">
        <div className="flex items-center space-x-2 pl-2 sm:pl-4 md:pl-8 lg:pl-12">
          <NavLink to="/">
            <button
              type="button"
              name="button"
              className={`text-dark hover:bg-light hover:text-dark ${location.pathname === '/' ? 'bg-purple text-light hover:text-dark' : ''} rounded-full px-3 py-2 font-semibold sm:px-4 sm:py-3`}>
              Home
            </button>
          </NavLink>
          <button
            type="button"
            name="button"
            onClick={onCreateClick}
            className={`rounded-full px-4 py-2 font-semibold text-dark hover:bg-light sm:px-5 sm:py-3 ${location.pathname === '/post/create' ? 'bg-purple text-light hover:text-dark' : ''}`}>
            Create
          </button>
        </div>

        {login ? (
          <div className="flex items-center space-x-2 pr-2 sm:pr-4 md:pr-8 lg:pr-12">
            <NavLink to="/profile/me">
              <button
                type="button"
                name="button"
                className={`rounded-full px-3 py-2 font-semibold text-dark hover:bg-light sm:px-4 sm:py-3 ${location.pathname === '/profile/me' ? 'bg-purple text-light hover:text-dark' : ''}`}>
                Profile
              </button>
            </NavLink>
            <button
              type="button"
              name="button"
              onClick={onLogoutClick}
              className={`rounded-full px-3 py-2 font-semibold text-dark hover:bg-light sm:px-4 sm:py-3`}>
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center space-x-2 pr-2 sm:pr-4 md:pr-8 lg:pr-12">
            <button
              type="button"
              name="button"
              onClick={onLoginClick}
              className={`rounded-full px-3 py-2 font-semibold text-dark hover:bg-light sm:px-4 sm:py-3 ${modal === 'login' ? 'bg-purple text-light hover:text-dark' : ''}`}>
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
              className={`font-poppins rounded-full px-3 py-2 font-semibold text-dark hover:bg-light sm:px-4 sm:py-3 ${modal === 'signup' ? 'bg-purple text-light hover:text-dark' : ''}`}>
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
      <Toaster />
    </div>
  );
};

export default Header;
