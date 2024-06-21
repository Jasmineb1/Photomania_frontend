import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { CloudUpload } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { PostData, postSchema } from '../schema/zodSchema';

const CreatePost = () => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);

  const navigate = useNavigate();
  const token = Cookies.get('token');
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(postSchema)
  });

  const { mutate } = useMutation({
    mutationFn: async (data: PostData) => {
      const formData = new FormData();
      if (file) {
        formData.append('image', file);
      }
      formData.append('postCaption', data.caption);
      formData.append('postDesc', data.description);

      const response = await fetch('http://localhost:5000/post', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Failed to create post');
      }
    },
    onSuccess: () => {
      navigate('/profile/me');

      toast.success('Post added successfully');
    },
    onError: (error) => {
      error.message.includes('jwt malformed');
      const errorMessage = 'You are not authorized!';

      toast.error(`An error occurred. ${errorMessage}`);
    }
  });

  const submitData = (data: PostData) => {
    mutate(data);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    if (selectedFile) {
      setFile(selectedFile);
      setValue('image', selectedFile);

      const reader = new FileReader();
      reader.onload = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };
  if (!token) {
    return (
      <div className='className="text-center font-bold" text-2xl'>You are not authorized!</div>
    );
  }

  return (
    <div>
      <h1 className="my-6 text-center text-xl font-bold leading-tight tracking-tight text-purple md:text-2xl">
        Create Post
      </h1>
      <form className="" onSubmit={handleSubmit(submitData)}>
        <div className="sm-[70%] m-auto grid h-screen grid-cols-2 gap-0">
          <div className="col-span-1 flex">
            <label
              className={`${
                imagePreview
                  ? 'mx-10 flex h-[70%] w-full flex-col items-center'
                  : 'mx-10 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 lg:h-[70%]'
              } `}>
              <input
                id="dropzone-file"
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileInputChange}
              />
              {imagePreview ? (
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-full overflow-hidden rounded-lg object-cover"
                />
              ) : (
                <div className="flex flex-col items-center justify-center pb-6 pt-5">
                  <CloudUpload />
                  <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                    <span className="font-semibold">Click to upload image</span>
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG</p>
                </div>
              )}
              {errors.image && <p className="text-red-700">{errors.image.message}</p>}
            </label>
          </div>
          {/* Second */}
          <div className="col-span-1 h-full">
            <div className="flex h-full flex-col items-center justify-center px-6">
              <div className="w-full flex-1">
                <div className="space-y-2 md:space-y-4">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-gray-900">Caption</label>
                    <input
                      type="text"
                      id="text"
                      placeholder="Your caption"
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
                      placeholder="Description"
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      {...register('description')}></textarea>
                    {errors.description && (
                      <p className="text-red-700">{errors.description.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-purple px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                    Create Post
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
