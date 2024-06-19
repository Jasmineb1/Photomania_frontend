import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { useModal } from '../context/ModalContext';
import { UserProfile } from '../types';
import EditProfile from './EditProfile';
import Loader from './Loader';
import Modal from './Modal';
import UserPosts from './UserPosts';

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Profile = () => {
  const token = Cookies.get('token');
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
    // navigate(`/profile/edit/${id}`);
    setModal('edit');
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

  // console.log('User data from profile', userData);
  // console.log('user photo url', userPhoto);

  if (!userData) {
    return <div>An error occurred. User data is missing.</div>;
  }

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
      <section className="mb-10 flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <img
            src={
              `http://localhost:5000/${userPhoto.replace('public\\images\\', 'images/')}` ||
              `https://via.placeholder.com/150`
            }
            alt="User Avatar"
            className="mr-4 h-60 w-60 items-center rounded-full sm:h-40 sm:w-40 md:h-48 md:w-48"
          />
          <div className="mt-6 flex flex-row items-center">
            <h2 className="text-center text-2xl font-bold">{userData.username}</h2>
          </div>
          <p className="text-center text-gray-600">{userData.username}</p>
        </div>
        <button
          className="rounded-xl border-2 border-white bg-purple p-2 text-white hover:bg-lilac hover:text-black"
          onClick={handleEditClick}>
          Edit Profile
        </button>
      </section>
      <div>
        <h2 className="text-bold text-center text-2xl">My Posts</h2>
        <UserPosts />
      </div>
    </div>
  );
};

export default Profile;
