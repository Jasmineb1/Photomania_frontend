import { Trash2, X } from 'lucide-react';
import react from 'react';

import { useModal } from '../context/ModalContext';
import { useDeleteQuery } from '../query/queries';

interface DeleteModalProps {
  postId?: string;
}

const DeleteModal: react.FC<DeleteModalProps> = ({ postId }) => {
  const mutateDeletePost = useDeleteQuery();
  const { setModal } = useModal();

  const handleDelete = () => {
    if (postId) {
      mutateDeletePost.mutate(postId);
    }
    return;
  };
  const handleClose = () => {
    setModal(null);
  };
  return (
    <>
      <div
        id="deleteModal"
        aria-hidden={false}
        className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto overflow-x-hidden bg-gray-900 bg-opacity-50">
        <div className="relative w-full max-w-md p-4 md:h-auto">
          <div className="relative rounded-lg bg-white p-4 text-center shadow sm:p-5 dark:bg-gray-800">
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-2.5 top-2.5 ml-auto inline-flex items-center rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white">
              <X />

              <span className="sr-only">Close modal</span>
            </button>
            <div className="mb-8 mt-8 flex items-center justify-center">
              <Trash2 />
            </div>

            <p className="mb-4 text-gray-500 dark:text-gray-300">
              Are you sure you want to delete this item?
            </p>
            <div className="flex items-center justify-center space-x-4">
              <button
                type="button"
                onClick={handleClose}
                className="focus:ring-primary-300 rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:z-10 focus:outline-none focus:ring-4 dark:border-gray-500 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:hover:text-white dark:focus:ring-gray-600">
                No, cancel
              </button>
              <button
                type="submit"
                onClick={handleDelete}
                className="rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:focus:ring-red-800">
                Yes, delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
