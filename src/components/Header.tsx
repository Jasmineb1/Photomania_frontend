import { useModal } from '../context/ModalContext';
import { useNav } from '../context/NavContext';
import { Nav } from '../types';
import SignupModal from './Modal';
import SignupForm from './SignupForm';

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
    <div className="bg-lilac flex h-20 items-center justify-between p-3">
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
      <div className="relative flex-grow">
        <button className="px-3 py-4">
          <img src="photomania1.png" alt="photomania logo" className="w-[100px]" />
        </button>
      </div>
      <div className="mx-20 flex items-center">
        <button
          type="button"
          name="button"
          className={`rounded-full px-4 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Login ? 'bg-purple text-light hover:text-dark' : ''} w-min`}
          onClick={onLoginClick}>
          Login
        </button>

        <button
          type="button"
          name="button"
          className={`font-poppins rounded-full px-5 py-3 font-semibold text-dark hover:bg-light ${nav === Nav.Signup ? 'bg-purple text-light hover:text-dark' : ''}`}
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
