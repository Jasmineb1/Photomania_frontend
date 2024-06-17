import { CircleLoader } from 'react-spinners';

const Loader = () => {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex items-center">
        <CircleLoader color="#55356E" loading size={200} />
      </div>
    </div>
  );
};

export default Loader;
