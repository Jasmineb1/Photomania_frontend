import { useQuery } from '@tanstack/react-query';

import { FetchResults } from '../types';

export const usePostsQuery = () => {
  return useQuery<FetchResults>({
    queryKey: ['posts'],
    queryFn: async () => {
      const response = await fetch('http://localhost:5000/posts');
      if (!response.ok) {
        throw new Error('Failed to fetch posts');
      }
      return response.json();
    }
  });
};
