import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { NavLink } from 'react-router-dom';

import { UserPost } from '../types';
import Loader from './Loader';

interface DecodedToken extends JwtPayload {
  userId: string;
}
type UserPostsProps = {
  userIdParams: string | undefined;
};

const UserPosts = ({ userIdParams }: UserPostsProps) => {
  const token = Cookies.get('token');

  let id: string | undefined;

  let decoded: DecodedToken | null = null;
  if (token) {
    decoded = jwtDecode<DecodedToken>(token);
  }
  if (decoded) {
    id = decoded.userId;
  }

  const getUrl = () => {
    if (userIdParams && id !== userIdParams) {
      return `http://localhost:5000/user/post/${userIdParams}`;
    }

    return `http://localhost:5000/user/post/${id}`;

    // let url = '';
    // if (location.state?.from === '/post/view' && userIdParams) {
    //   console.log('Mathi ko wala bhayo!!', { userIdParams });
    //   url = `http://localhost:5000/user/post/${userIdParams}`;
    // }
    // console.log('Default bhayiracha', id);
    // url = `http://localhost:5000/user/post/${id}`;
    // return url;
  };
  const { isLoading, isError, data, error } = useQuery<UserPost>({
    queryKey: ['userPosts'],
    queryFn: async () => {
      const response = await fetch(getUrl());
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    }
  });

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (isError) return <div>An error occurred: {error.message}</div>;

  if (!data || !data.userPostdata || data.userPostdata.length === 0) {
    return <div>Nothing to show!</div>;
  }

  const postData = data.userPostdata;

  return (
    <>
      <div className="mt-10">
        <div className="mr-10 grid grid-cols-4 gap-2 md:grid-cols-4">
          {postData &&
            postData.map((post) => (
              <div
                key={post.postId}
                className="mb-6 overflow-hidden rounded-lg border-2 border-gray-300"
                style={{ width: '250px', height: '300px ' }}>
                <NavLink to={`/post/view/${post.postId}`}>
                  <img
                    className="h-full w-full object-cover"
                    src={`http://localhost:5000/${post.postImg.replace('public\\images\\', 'images/')}`}
                    alt={post.imageName}
                  />
                </NavLink>
              </div>
            ))}
        </div>
      </div>
    </>
  );
};

export default UserPosts;
