import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast, Toaster } from 'sonner';

import { PostData, postUpdateSchema } from '../schema/zodSchema';

const EditPost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const location = useLocation();
  const { postId, image, caption, description } = location.state || {};

  const navigate = useNavigate();
  const token = Cookies.get('token');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(postUpdateSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: PostData) => {
      const formData = new FormData();
      //   formData.image('postImg', data.image);
      formData.append('postCaption', data.caption);
      formData.append('postDesc', data.description);

      const response = await fetch(`http://localhost:5000/user/post/${postId}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        toast.error('Failed to update!');
        throw new Error('Failed to edit post');
      }
    },
    onSuccess: () => {
      console.warn('Post updated');
      toast.success('Post updated successfully');
      navigate(`/post/view/${postId}`);
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });
  useEffect(() => {
    if (image) {
      setImagePreview(image);
    }
    if (caption) {
      setValue('caption', caption);
    }
    if (description) {
      setValue('description', description);
    }
  }, [image, caption, description, setValue]);

  const submitData = (data: PostData) => {
    mutate(data);
    console.warn(data);
  };

  return (
    <>
      <div>
        <Toaster />
      </div>
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(submitData)}>
        <div className="fixed left-0 right-0 m-auto grid h-screen grid-cols-2 gap-0">
          {/* First Column */}
          <div className="col-span-1 flex h-full items-center justify-center">
            <label
              className={`${
                imagePreview ? 'h-auto' : 'h-screen'
              } dark:hover:bg-bray-800 mx-10 my-8 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}>
              <img
                src={`http://localhost:5000/${image.replace('public\\images\\', 'images/')}`}
                alt="Image Preview"
                className="h-auto w-full rounded-lg object-cover"
              />
            </label>
          </div>

          {/* Second Column */}
          <div className="col-span-1 h-full">
            <div className="flex h-full flex-col items-center justify-center px-6 py-8">
              <h1 className="mb-20 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Edit Post
              </h1>
              <div className="w-full flex-1">
                <div className="space-y-4 p-6 sm:p-8 md:space-y-6">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Caption
                    </label>
                    <input
                      type="text"
                      id="text"
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      {...register('caption')}
                    />
                    {errors.caption && <p>{errors.caption.message}</p>}
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">
                      Description
                    </label>
                    <textarea
                      id="Description"
                      rows={6}
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      {...register('description')}></textarea>
                    {errors.description && <p>{errors.description.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-purple px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                    Update Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};

export default EditPost;
