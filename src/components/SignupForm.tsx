import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { z, ZodType } from 'zod';

import { useModal } from '../context/ModalContext';
import { Users } from '../types';

const SignupForm = () => {
  const { setModal } = useModal();
  const onCloseClick = () => {
    setModal(false);
  };
  const schema: ZodType<Users> = z.object({
    username: z
      .string({ message: 'Username must be a string' })
      .min(4, { message: 'Username must contain atleast 4 characters' }),
    email: z
      .string()
      .min(1, { message: 'Fields cannot be empty' })
      .email({ message: 'Email not valid' }),
    password: z.string().min(6, { message: 'Password must be atleast 6 characters' }).max(15)
  });
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Users>({
    resolver: zodResolver(schema)
  });
  const { mutate, isLoading, error } = useMutation((data: Users) =>
    fetch('http://localhost:5000/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    }).then((res) => res.json())
  );
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {}</div>;

  const submitData = (data: Users) => {
    mutate(data);
    console.warn(data.email);
  };
  return (
    <>
      <section className="bg-white-50 backdrop-blur-lg dark:bg-gray-900">
        <div className="mx-auto flex flex-col items-center justify-center px-6 py-8 md:h-screen lg:py-0">
          <button className="... absolute right-0 top-0 h-16 w-16" onClick={onCloseClick}>
            <X />
          </button>
          <a
            href="#"
            className="mb-6 flex items-center text-2xl font-semibold text-gray-900 dark:text-white">
            <img className="mr-2 h-8 w-10" src="favicon1.png" alt="logo" />
            Photomania
          </a>
          <div className="w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
            <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
              <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create an account
              </h1>
              <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(submitData)}>
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
                    <span className="text-red-900">{errors.username.message}</span>
                  )}
                </div>
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
                  className="bg-dark hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                  Create an account
                </button>
                <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                  Already have an account?{' '}
                  <a
                    href="#"
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
