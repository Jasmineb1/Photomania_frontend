import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { X } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';
import { userDetailsSchema, userSchema } from '../schema/zodSchema';
import { UserDetail } from '../types';

interface FormData {
  firstName: string;
  lastName: string;
  about: string;
}
const EditProfile = ({ firstName, lastName, about, id }: UserDetail) => {
  const token = Cookies.get('token');
  const { setModal } = useModal();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(userDetailsSchema)
  });
  const { mutate } = useMutation({
    mutationFn: async (data: userSchema) => {
      const formData = new FormData();

      formData.append('firstName', data.firstName);
      formData.append('lastName', data.lastName);
      formData.append('about', data.about);

      const response = await fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast.error('Failed to update!');
        throw new Error('Failed to update data');
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] });
      toast.success('User data updated successfully');
      setModal(null);
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });

  const submitData = (data: FormData) => {
    mutate(data);
  };

  const onCloseClick = () => {
    setModal(null);
  };
  useEffect(() => {
    if (firstName) {
      setValue('firstName', firstName);
    }
    if (lastName) {
      setValue('lastName', lastName);
    }
    if (about) {
      setValue('about', about);
    }
  }, [firstName, lastName, about, setValue]);

  return (
    <section className="bg-white-50 mx-50 my-0 h-1/2 w-screen dark:bg-gray-900">
      <div className="mx-auto flex flex-col items-center justify-center px-2 py-2 lg:py-1">
        <div className="relative w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:h-full xl:p-0 dark:border dark:border-gray-700 dark:bg-gray-800">
          <button
            className="absolute right-0 top-0 m-0 h-12 w-12 text-purple"
            onClick={onCloseClick}>
            <X />
          </button>
          <div className="relative flex items-center justify-center rounded-lg bg-white p-4 dark:bg-gray-900">
            <form className="w-full max-w-md p-4" onSubmit={handleSubmit(submitData)}>
              <div
                className="absolute right-0 top-0 p-2 hover:cursor-pointer"
                onClick={onCloseClick}>
                <X />
              </div>
              <h2 className="mb-4 text-xl font-semibold text-purple">Edit Profile Details</h2>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">First name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register('firstName')}
                />
                {errors.firstName && <p className="text-red-700">{errors.firstName.message}</p>}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">Last name</label>
                <input
                  type="text"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register('lastName')}
                />
                {errors.lastName && <p className="mb-2 text-red-700">{errors.lastName.message}</p>}
              </div>
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700">About</label>
                <textarea
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  {...register('about')}></textarea>
                {errors.about && <p className="text-red-700">{errors.about.message}</p>}
              </div>

              <button
                type="submit"
                className="mt-2 w-full rounded-md bg-purple px-4 py-2 text-white hover:bg-lilac hover:text-black">
                Save
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditProfile;
