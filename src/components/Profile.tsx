import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';

import { UserResponse } from '../types';
import Loader from './Loader';
import UserPosts from './UserPosts';

interface DecodedToken extends JwtPayload {
  userId: string;
}

const Profile = () => {
  const token = Cookies.get('token');
  let id: string | undefined;
  let decoded: DecodedToken | null = null;

  if (token) {
    decoded = jwtDecode(token);
  }

  if (decoded) {
    id = decoded.userId;
  }

  const { isLoading, isError, data, error } = useQuery<UserResponse>({
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

  if (!userData) {
    return <div>An error occurred. User data is missing.</div>;
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <section className="mb-10 flex flex-col items-center">
        <div className="mb-4 flex flex-col items-center">
          <img
            src="https://via.placeholder.com/150"
            alt="User Avatar"
            className="mr-4 h-60 w-60 items-center rounded-full sm:h-40 sm:w-40 md:h-48 md:w-48"
          />
          <div className="mt-6 flex flex-row items-center">
            <h2 className="text-center text-2xl font-bold">{userData.username}</h2>
          </div>
          <p className="text-center text-gray-600">{userData.username}</p>
        </div>
        <button className="rounded-xl border-2 border-black bg-lilac p-2 hover:border-white hover:bg-purple hover:text-white">
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
