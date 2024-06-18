import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { useLogin } from '../context/LoginContext';
import { useModal } from '../context/ModalContext';
import { loginSchema } from '../schema/zodSchema';
import { LoginUser } from '../types';
const LoginForm = () => {
  const { setModal } = useModal();
  const { setLogin } = useLogin();
  const location = useLocation();
  const navigate = useNavigate();

  const onCloseClick = () => {
    setModal(null);
  };
  const onSignupClick = () => {
    setModal('signup');
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginUser>({
    resolver: zodResolver(loginSchema)
  });

  const { mutate } = useMutation({
    mutationFn: (data: LoginUser) => {
      return fetch('http://localhost:5000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      }).then((res) => {
        return res.json();
      });
    },
    onSuccess: (data) => {
      if (data.status === 'error') {
        toast.error('Login Unsuccessful!');
      } else {
        document.cookie = `token=${data.token}; path=/;`;
        toast.success('Logged in successfully!');
        setModal(null);
        setLogin(true);
      }

      const state = location.state;
      if (state != null) {
        state.from === '/post/create' ? navigate('/post/create') : '';
      }
    },
    onError: () => {
      toast.error('Error in login');
    }
  });

  const submitData: SubmitHandler<LoginUser> = (data) => {
    mutate(data);
    console.warn(data.email);
  };
  return (
    <>
      <section className="bg-black-50 mx-50 my-0 w-screen dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <div className="relative w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <button
              className="... absolute right-0 top-0 m-0 h-12 w-12 text-purple"
              onClick={onCloseClick}>
              <X />
            </button>
            <div className="my-4 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lilac md:h-20 md:w-20">
                <img className="h-10 w-16" src="photomania1.png" alt="logo" />
              </div>
            </div>
            <div className="flex justify-center">
              <a
                href="#"
                className="mxy-0.5 font-poppins flex text-center text-2xl font-semibold text-gray-900 dark:text-white">
                Photomania
              </a>
            </div>
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Login
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(submitData)}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@company.com"
                    {...register('email')}
                  />
                  {errors.email && <span className="text-red-900">{errors.email.message}</span>}
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    placeholder="••••••••"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    {...register('password')}
                  />
                  {errors.password && (
                    <span className="text-red-900">{errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-purple px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                  Login
                </button>
                <p className="font-poppins text-sm font-light text-gray-500 dark:text-gray-400">
                  Don't have an account?{' '}
                  <a
                    href="#"
                    onClick={onSignupClick}
                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                    Sign Up here
                  </a>
                </p>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default LoginForm;
