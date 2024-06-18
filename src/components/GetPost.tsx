import { NavLink } from 'react-router-dom';

import { useModal } from '../context/ModalContext';
import { usePostsQuery } from '../query/queries';
import Loader from './Loader';

const GetPost = () => {
  const { modal } = useModal();

  const { data, error, fetchNextPage, isFetching, isLoading } = usePostsQuery();
  console.warn(data);
  // const [infiniteRef] = useInfiniteScroll({
  //   loading: isLoading,
  //   hasNextPage: hasNextPage,
  //   onLoadMore: fetchNextPage,
  //   rootMargin: '0px 0px 400px 0px'
  // });
  if (isLoading) return <Loader />;
  if (error) return <div>An error has occurred: {error.message}</div>;
  if (isFetching) return <Loader />;
  if (!data) {
    return <p>'No data!'</p>;
  }
  const posts = data.pages.flatMap((page) => {
    return page.posts;
  });
  console.warn('Posts:', posts);
  return (
    <>
      <div className={`${modal === null ? '' : 'fixed'}`}>
        <h1 className="my-4 text-center text-3xl font-semibold text-purple">Explore</h1>
        <div className="mx-10 my-10 columns-2 gap-4 space-y-4 md:columns-4">
          {data &&
            posts.map((post) => (
              <div className="break-inside-avoid overflow-hidden rounded-lg border-2 border-gray-300">
                <NavLink to={`post/view/${post.postId}`}>
                  <img
                    className="w-full object-cover"
                    src={`http://localhost:5000/${post.postImg.replace('public\\images\\', 'images/')}`}
                    alt={post.imageName}
                  />
                </NavLink>
                {/* <p>Caption: {post.postCaption}</p>
              <p>Description: {post.postDesc}</p>
              <p>Posted At: {new Date(post.postedAt).toLocaleString()}</p>
              <p>Updated At: {new Date(post.postedAt).toLocaleString()}</p> */}
              </div>
            ))}
        </div>
        {/* {hasNextPage && <div ref={infiniteRef}></div>} */}
        <button
          onClick={() => {
            fetchNextPage();
          }}>
          Click to fetct more
        </button>
      </div>
    </>
  );
};

export default GetPost;
