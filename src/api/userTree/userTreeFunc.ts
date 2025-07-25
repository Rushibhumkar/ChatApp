import {API_AXIOS} from '../axiosInstance';
import {useQuery} from '@tanstack/react-query';

// -----------------------------
// 1. GET: My Tree
// Endpoint: /u-tree/my-tree
// -----------------------------
export const getMyTree = async () => {
  try {
    const {data} = await API_AXIOS.get('/u-tree/my-tree');
    return data;
  } catch (error: any) {
    console.error('Error fetching my tree:', error.response || error);
    throw error;
  }
};

export const useGetMyTree = () => {
  return useQuery({
    queryKey: ['myTree'],
    queryFn: getMyTree,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// -----------------------------
// 2. GET: Tree by User ID
// Endpoint: /u-tree/:id
// -----------------------------
export const getTreeByUserId = async (userId: string) => {
  try {
    const {data} = await API_AXIOS.get(`/u-tree/${userId}`);
    return data;
  } catch (error: any) {
    console.error('Error fetching tree by user ID:', error.response || error);
    throw error;
  }
};

export const useGetTreeByUserId = (userId: string) => {
  return useQuery({
    queryKey: ['treeByUser', userId],
    queryFn: () => getTreeByUserId(userId),
    enabled: !!userId,
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

// -----------------------------
// 3. POST: Add Member to Tree
// Endpoint: /u-tree/add-member
// -----------------------------
export const addMemberToTree = async (memberData: Record<string, any>) => {
  try {
    const {data} = await API_AXIOS.post('/u-tree/add-member', memberData);
    return data;
  } catch (error: any) {
    console.error('Error adding member to tree:', error.response || error);
    throw error;
  }
};
