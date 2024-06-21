import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PostData, postUpdateSchema } from '../schema/zodSchema';

const EditPost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { sentFrom, postId, image, caption, description } = location.state || {};

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
      toast.success('Post updated successfully');
      navigate(`/post/view/${postId}`);
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });
  useEffect(() => {
    if (image) {
      setImagePreview(image.replace('public\\images\\', 'images/'));
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
  };
  if (sentFrom != '/post/view') {
    return <div className="text-center text-2xl font-bold">Not authorized!</div>;
  }
  // if (!token) {
  //   return <div>You are not authorized!</div>;
  // }

  return (
    <>
      <div className="">
        <h1 className="my-6 text-center text-xl font-bold leading-tight tracking-tight text-purple md:text-2xl">
          Edit Post
        </h1>
        <form className="" onSubmit={handleSubmit(submitData)}>
          <div className="m-auto grid h-screen grid-cols-2 gap-0">
            <div className="col-span-1 flex">
              <label className={`mx-10 flex h-[70%] w-full flex-col items-center`}>
                <img
                  src={`http://localhost:5000/${imagePreview}`}
                  alt="Image Preview"
                  className="w-full overflow-hidden rounded-lg object-cover"
                />
              </label>
            </div>

            {/* Second Column */}
            <div className="col-span-1 h-full">
              <div className="flex h-full flex-col items-center justify-center px-6">
                <div className="w-full flex-1">
                  <div className="space-y-2 md:space-y-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-gray-900">
                        Caption
                      </label>
                      <input
                        type="text"
                        id="text"
                        className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm"
                        {...register('caption')}
                      />
                      {errors.caption && <p className="text-red-700">{errors.caption.message}</p>}
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
                      {errors.description && (
                        <p className="text-red-700">{errors.description.message}</p>
                      )}
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
      </div>
    </>
  );
};

export default EditPost;
