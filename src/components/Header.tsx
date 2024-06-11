import { useModal } from '../context/ModalContext';
import { useNav } from '../context/NavContext';
import { Nav } from '../types';
import SignupForm from './SignupForm';
import SignupModal from './SignupModal';

const Header = () => {
  const { modal, setModal } = useModal();

  const { nav, setNav } = useNav();
  const onHomeClick = () => {
    setNav(Nav.Home);
  };
  const onCreateClick = () => {
    setNav(Nav.Create);
  };
  const onLoginClick = () => {
    setNav(Nav.Login);
  };

  const onSignupClick = () => {
    setNav(Nav.Signup);
    setModal(true);
  };

  // const closeModal = () => {
  //   setModal(false); // Close modal
  // };
  return (
    <div className="mx-20 flex items-center justify-between p-3">
      <div className="flex items-center">
        <button
          type="button"
          name="button"
          onClick={onHomeClick}
          className={`text-dark hover:bg-light ${nav == Nav.Home ? 'bg-dark text-light hover:text-dark' : ''} w-min rounded-full px-4 py-3 font-semibold`}>
          Home
        </button>
        <button
          type="button"
          name="button"
          className={`text-dark hover:bg-light rounded-full px-5 py-3 font-semibold ${nav === Nav.Create ? 'bg-dark text-light hover:text-dark' : ''} w-min`}
          onClick={onCreateClick}>
          Create
        </button>
      </div>
      <div className="relative flex-grow">
        <button className="px-3 py-4">
          <img src="photomania1.png" alt="photomania logo" className="w-[100px]" />
        </button>
      </div>
      <div className="flex items-center">
        <button
          type="button"
          name="button"
          className={`text-dark hover:bg-light rounded-full px-4 py-3 font-semibold ${nav === Nav.Login ? 'bg-dark text-light hover:text-dark' : ''} w-min`}
          onClick={onLoginClick}>
          Login
        </button>

        <button
          type="button"
          name="button"
          className={`text-dark hover:bg-light rounded-full px-5 py-3 font-semibold ${nav === Nav.Signup ? 'bg-dark text-light hover:text-dark' : ''}`}
          onClick={onSignupClick}>
          Sign Up
        </button>
        {modal ? (
          <SignupModal>
            {' '}
            <SignupForm />
          </SignupModal>
        ) : (
          ''
        )}
      </div>
    </div>
  );
};

export default Header;
