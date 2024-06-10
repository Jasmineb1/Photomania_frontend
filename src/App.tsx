import { useQuery } from 'react-query';

import { FetchResults } from './types';
function App() {
  const { isLoading, error, data } = useQuery({
    queryKey: ['posts'],
    queryFn: (): Promise<FetchResults> =>
      fetch('http://localhost:5000/posts').then((res) => res.json())
  });
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>An error has occurred: {}</div>;
  const image = data?.postDetails;
  console.warn('The image url: ', image);
  // const postImage = data.postDetails.post_img.replace('public\\', '');
  // console.log('this is app');
  console.warn(data);
  return (
    <>
      <div>
        <h1 className="bg-black text-3xl text-white">This is the index page!</h1>
        <h2 className="text-2xl"> The tailwind config is working well!</h2>
        <h2>The post details have been fetched: </h2>

        {data &&
          data.postDetails.map((post) => (
            <div key={post.post_id}>
              <h2>Post ID: {post.post_id}</h2>
              <img
                src={`localhost:5000/${post.post_img.replace('public\\images\\', 'images/')}`}
                alt={post.image_name}
              />
              <p>Caption: {post.post_caption}</p>
              <p>Description: {post.post_desc}</p>
              <p>Posted At: {new Date(post.posted_at).toLocaleString()}</p>
              <p>Updated At: {new Date(post.posted_at).toLocaleString()}</p>
            </div>
          ))}
      </div>
    </>
  );
}

export default App;
