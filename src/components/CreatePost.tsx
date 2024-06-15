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
  const [uploaded, setUploaded] = useState<boolean>(false);

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
      console.warn('Post added');
      setUploaded(true);
      toast.success('Post added successfully');
    },
    onError: (error) => {
      toast.error('An error occurred');
      console.warn(error);
    }
  });

  const submitData = (data: PostData) => {
    console.warn('Button clicked!', data);
    mutate(data);
    // console.warn(uploaded);
    uploaded ? navigate('/') : '';
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

  return (
    <>
      <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(submitData)}>
        <div className="fixed left-0 right-0 m-auto grid h-screen grid-cols-2 gap-0">
          {/* First Column */}
          <div className="col-span-1 flex h-full items-center justify-center">
            <label
              className={`${
                imagePreview ? 'h-auto' : 'h-screen'
              } dark:hover:bg-bray-800 mx-10 my-8 flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-600`}>
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
                  className="h-auto w-full rounded-lg object-cover"
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
              {errors.image && <p>{errors.image.message}</p>}
            </label>
          </div>

          {/* Second Column */}
          <div className="col-span-1 h-full">
            <div className="flex h-full flex-col items-center justify-center px-6 py-8">
              <h1 className="mb-20 text-center text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                Create a Post
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
                      placeholder="Your Post Caption"
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
                      placeholder="Describe your post"
                      className="focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-gray-900 sm:text-sm dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                      {...register('description')}></textarea>
                    {errors.description && <p>{errors.description.message}</p>}
                  </div>

                  <button
                    type="submit"
                    className="hover:bg-primary-700 focus:ring-primary-300 dark:bg-primary-600 dark:hover:bg-primary-700 dark:focus:ring-primary-800 w-full rounded-lg bg-purple px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4">
                    Create
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

export default CreatePost;
