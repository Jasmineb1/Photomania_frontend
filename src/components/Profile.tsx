import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { Pen } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { useModal } from '../context/ModalContext';
import { queryClient } from '../main';
import { PostData, userPhotoSchema } from '../schema/zodSchema';
import { PhotoDetail, UserProfile } from '../types';
import EditProfile from './EditProfile';
import Loader from './Loader';
import Modal from './Modal';
import UserPosts from './UserPosts';

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Profile = () => {
  const {
    handleSubmit,
    formState: { errors }
  } = useForm<PostData>({
    resolver: zodResolver(userPhotoSchema)
  });
  const token = Cookies.get('token');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showEditDeleteOptions, setShowEditDeleteOptions] = useState(false);
  let id: string | undefined;
  let decoded: DecodedToken | null = null;

  const { modal, setModal } = useModal();

  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const handleEditClick = () => {
    setModal('edit');
  };

  const { mutate: mutatePhoto } = useMutation({
    mutationFn: async (data: PhotoDetail) => {
      const formData = new FormData();
      if (data?.userImg) {
        formData.append('image', data.userImg);
      }

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
        throw new Error('Failed to update photo');
      }
    },
    onSuccess: () => {
      console.warn('Photo updated!');
      toast.success('Photo updated successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('An error occurred');
    }
  });

  const { mutate: deletePhoto } = useMutation({
    mutationFn: async () => {
      const response = await fetch(`http://localhost:5000/profile/edit/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error(errorData);
        throw new Error('Failed to delete photo');
      }
    },
    onSuccess: () => {
      toast.success('Photo deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('An error occurred while deleting the photo');
    }
  });

  const submitData = (data: PostData) => {
    mutatePhoto({
      userImg: data.image
    });
  };

  const { isLoading, isError, data, error } = useQuery<UserProfile>({
    queryKey: ['user'],
    queryFn: async () => {
      if (!id) {
        throw new Error('User ID not found');
      }
      const response = await fetch(`http://localhost:5000/profile/me/${id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch profile');
      }
      return response.json();
    },
    enabled: !!id
  });

  if (isLoading) {
    return (
      <div>
        <Loader />
      </div>
    );
  }

  if (isError) {
    return <span>Error: {error.message}</span>;
  }

  if (!data) {
    return <div>An error occurred. No data received.</div>;
  }

  const userData = data.userdata;
  const userPhoto = userData.userImg || '';
  const userId: string = userData.id || '';

  if (!userData) {
    return <div>An error occurred. User data is missing.</div>;
  }

  const handleEditDeleteOptions = () => {
    setShowEditDeleteOptions(!showEditDeleteOptions);
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      mutatePhoto({
        userImg: file
      });
    }
  };

  const handleDeletePhoto = () => {
    deletePhoto();
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {modal === 'edit' ? (
        <Modal>
          <EditProfile
            userImg="null"
            id={userId}
            firstName={userData.firstName}
            lastName={userData.lastName}
            about={userData.about || ''}
          />
        </Modal>
      ) : (
        ''
      )}
      <div className="mb-10 ml-20">
        <section className="flex flex-col">
          <div className="items-left mt-10 flex flex-col md:flex-row">
            <div className="relative mb-4 flex-shrink-0 md:mr-4">
              {userPhoto ? (
                <img
                  src={`http://localhost:5000/${userPhoto.replace('public\\images\\', 'images/')}`}
                  alt="User Avatar"
                  className="h-60 w-60 rounded-full sm:h-40 sm:w-40 md:h-48 md:w-48"
                />
              ) : (
                <img
                  src={'https://via.placeholder.com/150'}
                  alt="User Avatar"
                  className="h-60 w-60 rounded-full sm:h-40 sm:w-40 md:h-48 md:w-48"
                />
              )}

              <div className="absolute bottom-0 right-0 p-2 hover:cursor-pointer">
                <button
                  onClick={handleEditDeleteOptions}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-300 text-gray-700 hover:bg-gray-400">
                  <Pen size={18} />
                </button>
                {showEditDeleteOptions && (
                  <div className="absolute left-4 mt-2 w-48 rounded-lg bg-white shadow-lg">
                    <form
                      className="block w-full px-4 py-2 text-left"
                      onSubmit={handleSubmit(submitData)}>
                      <label className="block w-full cursor-pointer rounded-lg p-2 hover:bg-lilac">
                        Edit Photo
                        <input type="file" className="hidden" onChange={handleFileChange} />
                      </label>
                      {errors.image && <p>{errors.image.message}</p>}
                    </form>
                    <button
                      className="block w-full rounded-lg px-4 py-2 text-left hover:bg-red-800"
                      onClick={handleDeletePhoto}>
                      Delete Photo
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="md:ml-4">
              <div className="mt-6 flex items-center justify-center">
                <h2 className="mr-4 text-center text-2xl font-bold">
                  {userData.firstName} {userData.lastName}
                </h2>
                <button
                  className="rounded-xl border-2 border-white bg-purple p-2 text-white hover:bg-lilac hover:text-black"
                  onClick={handleEditClick}>
                  Edit Profile
                </button>
              </div>
              <div className="flex flex-col">
                <p className="p-2 text-left text-gray-600">{userData.username}</p>
                <p className="p-2 text-left text-gray-600">{userData.about}</p>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h2 className="text-bold text-center text-2xl">My Posts</h2>
            <UserPosts />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Profile;
