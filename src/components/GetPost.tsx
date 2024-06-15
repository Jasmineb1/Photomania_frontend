import { useModal } from '../context/ModalContext';
import { usePostsQuery } from '../query/queries';

const GetPost = () => {
  const { loginModal, signupModal } = useModal();
  const { isLoading, error, data } = usePostsQuery();
  // const { isLoading, error, data } = useQuery<FetchResults>({
  //   queryKey: ['posts'],
  //   queryFn: async () => {
  //     const response = await fetch('http://localhost:5000/posts');
  //     return response.json();
  //   }
  // });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {}</div>;
  const image = data?.postDetails;
  console.warn('The image url: ', image);
  const postDetail = data?.postDetails;
  console.warn('post detail', postDetail);

  return (
    <>
      {/* <Header /> */}
      <div className={`w-full ${loginModal || signupModal ? 'fixed' : ''}`}>
        {data &&
          data.postDetails.map((post) => (
            <div key={post.postId}>
              <h2>Post ID: {post.postId}</h2>
              <img
                src={`http://localhost:5000/${post.postImg.replace('public\\images\\', 'images/')}`}
                alt={post.imageName}
              />
              <p>Caption: {post.postCaption}</p>
              <p>Description: {post.postDesc}</p>
              <p>Posted At: {new Date(post.postedAt).toLocaleString()}</p>
              <p>Updated At: {new Date(post.postedAt).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </>
  );
};

export default GetPost;
