import { useQuery } from '@tanstack/react-query';
import Cookies from 'js-cookie';
import { jwtDecode } from 'jwt-decode';
import { Ellipsis } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Toaster } from 'sonner';

import { useModal } from '../context/ModalContext';
import { JwtPayload } from '../types';
import DeleteModal from './DeleteModal';
import Loader from './Loader';
import Modal from './Modal';

const SinglePost = () => {
  const token = Cookies.get('token');
  // const mutateDeletePost = useDeleteQuery();
  const { modal, setModal } = useModal();
  const [dropdown, setDropdown] = useState<boolean>(false);
  const navigate = useNavigate();
  const { postId } = useParams();
  const [isLandscape, setIsLandscape] = useState(true);

  const { isLoading, error, data } = useQuery({
    queryKey: ['post', postId],
    queryFn: () => fetch(`http://localhost:5000/post/${postId}`).then((res) => res.json())
  });

  useEffect(() => {
    if (data && data.postData && data.postData.postImg) {
      const img = new Image();
      img.src = `http://localhost:5000/${data.postData.postImg.replace('public\\images\\', 'images/')}`;
      img.onload = () => {
        setIsLandscape(img.width > img.height);
      };
    }
  }, [data]);

  if (isLoading)
    return (
      <div>
        <Loader />
      </div>
    );

  if (error) return <div>An error occurred: {error.message}</div>;

  const post = data.postData;
  const user = post.userRegistration;

  let decoded: JwtPayload | null = null;
  if (token) {
    decoded = jwtDecode(token);
  }

  const handleDropdown = () => {
    setDropdown(!dropdown);
  };

  const handleEdit = () => {
    navigate(`/post/edit/${post.postId}`, {
      state: {
        postId: post.postId,
        image: post.postImg,
        caption: post.postCaption,
        description: post.postDesc
      }
    });
  };
  const handleDelete = () => {
    // mutateDeletePost.mutate(post.postId);
    setModal('delete');
  };
  return (
    <div>
      <div className="flex h-screen items-center justify-center">
        <div className="relative flex max-h-[90vh] w-4/5 flex-row rounded-lg p-4 shadow-lg">
          <div className="absolute right-2 top-0">
            {decoded && decoded.userId === user.id ? (
              <div className="hover:cursor-pointer" onClick={() => handleDropdown()}>
                <Ellipsis />
              </div>
            ) : (
              ''
            )}
            {dropdown && (
              <div className="absolute right-0 mr-2 mt-2 w-36 rounded-lg border border-gray-200 bg-white shadow-lg">
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-200"
                  onClick={handleEdit}>
                  Edit
                </button>

                <button
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-200"
                  onClick={handleDelete}>
                  Delete
                </button>
              </div>
            )}
          </div>

          <div
            className={`flex w-full flex-1 items-center justify-center overflow-hidden border-2 border-lightGray ${isLandscape ? 'max-h-[70vh]' : 'max-h-full'}`}>
            <img
              className={`rounded-lg object-contain ${isLandscape ? 'max-h-[70vh]' : 'max-h-full'}`}
              src={`http://localhost:5000/${data.postData.postImg.replace('public\\images\\', 'images/')}`}
              alt=""
            />
          </div>
          <div className="ml-10 mt-4 flex flex-1 flex-col overflow-auto">
            <div className="mb-2 text-lg font-extrabold">{post.postCaption}</div>
            <div className="text-md text-gray-500">{post.postCaption}</div>
            <div className="mb-2 mt-auto rounded-lg border-2 border-gray-300 p-2">
              <div className="mb-2 text-lg font-semibold">{user.username}</div>
              <div className="text-md">{user.email}</div>
            </div>
          </div>
        </div>
      </div>
      {modal === 'delete' && (
        <Modal>
          <DeleteModal postId={postId} />
        </Modal>
      )}
      <Toaster />
    </div>
  );
};

export default SinglePost;
