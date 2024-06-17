import { useInfiniteQuery } from '@tanstack/react-query';

import { FetchResults } from '../types';

export const usePostsQuery = () => {
  return useInfiniteQuery<FetchResults>({
    queryKey: ['posts'],
    queryFn: async ({ pageParam }) => {
      // const limit = 10;
      const response = await fetch(`http://localhost:5000/posts?page=${pageParam}&limit=10`);

      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    },
    getNextPageParam: (lastPage) => {
      return lastPage.totalPages === lastPage.currentPage ? undefined : lastPage.currentPage + 1;
    },
    initialPageParam: 1
  });
};
