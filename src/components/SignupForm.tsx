import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import { X } from 'lucide-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { signupSchema } from '../schema/zodSchema';
import { Users } from '../types';

const SignupForm = () => {
  const { setModal } = useModal();

  const onCloseClick = () => {
    setModal(null);
  };

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Users>({
    resolver: zodResolver(signupSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: Users) => {
      try {
        const response = await fetch('http://localhost:5000/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to register user');
        }

        return await response.json();
      } catch (error) {
        throw new Error(`Failed to register user: ${error}`);
      }
    },

    onSuccess: () => {
      setModal('login');
      toast.success('Registered Successfully!');
    },
    onError: (error) => {
      let errorMessage = 'Registration unsuccessful';
      if (error.message.includes('User already exists')) {
        errorMessage = 'User email already exists, please use another email!';
      }
      if (error.message.includes('Username exists')) {
        errorMessage = 'Username already exists, please use a new one!';
      }
      toast.error(` ${errorMessage}`);
    }
  });

  const submitData: SubmitHandler<Users> = (data) => {
    mutate(data);
  };
  const onLoginClick = () => {
    setModal('login');
  };
  return (
    <>
      <section className="bg-white-50 mx-50 my-0 w-screen dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-4 py-6 lg:py-4">
          <div className="relative w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:h-screen xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <button
              className="... absolute right-0 top-0 m-0 h-12 w-12 text-purple"
              onClick={onCloseClick}>
              <X />
            </button>
            <div className="my-2 flex justify-center">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-lilac md:h-20 md:w-20">
                <img className="h-10 w-16" src="/public/photomania1.png" alt="logo" />
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
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-4" onSubmit={handleSubmit(submitData)}>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="Username"
                    {...register('username')}
                  />
                  {errors.username && (
                    <span className="text-red-700">{errors.username.message}</span>
                  )}
                </div>
                <div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="First Name"
                        {...register('firstName')}
                      />
                      {errors.firstName && (
                        <span className="text-red-700">{errors.firstName.message}</span>
                      )}
                    </div>
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                        placeholder="Last Name"
                        {...register('lastName')}
                      />
                      {errors.lastName && (
                        <span className="text-red-700">{errors.lastName.message}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                    Your email
                  </label>
                  <input
                    type="email"
                    id="email"
                    className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                    placeholder="name@email.com"
                    {...register('email')}
                  />
                  {errors.email && <span className="text-red-700">{errors.email.message}</span>}
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
                    <span className="text-red-700">{errors.password.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-purple px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                  Create an account
                </button>
                <p className="font-poppins text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <a
                    href="#"
                    onClick={onLoginClick}
                    className="text-primary-600 dark:text-primary-500 font-medium hover:underline">
                    Login here
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

export default SignupForm;
