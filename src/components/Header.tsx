import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import { useNav } from '../context/NavContext';
import { Nav } from '../types';
import LoginForm from './LoginForm';
import Modal from './Modal';
import SignupForm from './SignupForm';

const Header = () => {
  const { loginModal, setLoginModal, signupModal, setSignupModal } = useModal();
  const { login, setLogin } = useLogin();

  const { nav, setNav } = useNav();
  const onHomeClick = () => {
    setNav(Nav.Home);
  };
  const onCreateClick = () => {
    setNav(Nav.Create);
  };

  const onLoginClick = () => {
    setNav(Nav.Login);
    setSignupModal(false);
    setLoginModal(true);
  };
  const onProfileClick = () => {
    setNav(Nav.Profile);
  };
  const onLogoutClick = () => {
    setNav(Nav.Logout);
    setLogin(false);
    document.cookie = 'token=; expires=Thu, 01 Jan 2000 00:00:00 UTC; path=/;';
    sessionStorage.removeItem('token');
    console.warn('logout successful');
  };

  const onSignupClick = () => {
    setNav(Nav.Signup);
    setLoginModal(false);
    setSignupModal(true);
  };

  return (
    <div className="flex h-20 items-center justify-between bg-lilac p-3">
      <div className="mx-20 flex items-center">
        <button
          type="button"
          name="button"
          onClick={onHomeClick}
          className={`text-dark hover:bg-light hover:text-dark ${nav == Nav.Home ? 'bg-purple text-light hover:text-dark' : ''} w-min rounded-full px-4 py-3 font-semibold`}>
          Home
        </button>
        <button
          type="button"
          name="button"
          className={`rounded-full px-5 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Create ? 'bg-purple text-light hover:text-dark' : ''} w-min`}
          onClick={onCreateClick}>
          Create
        </button>
      </div>
      {/* <div className="relative flex-grow">
        <button className="px-3 py-4">
          <img src="photomania1.png" alt="photomania logo" className="w-[100px]" />
        </button>
      </div> */}

      {login ? (
        <div className="mx-20 flex items-center">
          <button
            type="button"
            name="button"
            onClick={onProfileClick}
            className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Profile ? 'bg-purple text-light hover:text-dark' : ''} w-min`}>
            Profile
          </button>

          <button
            type="button"
            name="button"
            onClick={onLogoutClick}
            className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Logout ? 'bg-purple text-light hover:text-dark' : ''} w-min`}>
            Logout
          </button>
        </div>
      ) : (
        <div className="mx-20 flex items-center">
          <button
            type="button"
            name="button"
            className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Login ? 'bg-purple text-light hover:text-dark' : ''} w-min`}
            onClick={onLoginClick}>
            Login
          </button>
          {loginModal ? (
            <Modal>
              <LoginForm />
            </Modal>
          ) : (
            ''
          )}

          <button
            type="button"
            name="button"
            className={`font-poppins rounded-full px-5 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Signup ? 'bg-purple text-light hover:text-dark' : ''}`}
            onClick={onSignupClick}>
            Sign Up
          </button>
          {signupModal ? (
            <Modal>
              {' '}
              <SignupForm />
            </Modal>
          ) : (
            ''
          )}
        </div>
      )}
    </div>
  );
};

export default Header;
