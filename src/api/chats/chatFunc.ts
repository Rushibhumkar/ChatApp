import {useInfiniteQuery, useQuery} from '@tanstack/react-query';
import {API_AXIOS} from '../axiosInstance';

export const getFollowData = async (
  userId: string,
  searchValue: string = '',
) => {
  try {
    const {data} = await API_AXIOS.get(`/follow/${userId}`, {
      params: {searchValue},
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching follow data:', error.response || error);
    throw error;
  }
};

export const useGetFollowData = (userId: string, searchValue: string = '') => {
  return useQuery({
    queryKey: ['followData', userId, searchValue],
    queryFn: () => getFollowData(userId, searchValue),
    staleTime: 1000 * 60 * 5, // Cache data for 5 minutes
    refetchOnWindowFocus: false,
    enabled: !!userId, // Only run query if userId is available
  });
};

// Define Message Type
interface Message {
  id: string;
  sender: string;
  receiver: string;
  text: string;
  createdAt: string;
}

// Define API Response Type
interface MessagesResponse {
  messages: Message[];
  hasNextPage: boolean;
}
export const getMessages = async ({
  pageParam = 1,
  userObjId,
  limit = 10,
  searchValue = '',
}: {
  pageParam?: number;
  userObjId: string;
  limit?: number;
  searchValue?: string;
}): Promise<{messages: Message[]; nextPage: number | null}> => {
  try {
    const response = await API_AXIOS.get<MessagesResponse>(
      `/chat/${userObjId}`,
      {
        params: {limit, searchValue, page: pageParam},
      },
    );

    console.log('API Response:', response.data); // Debugging API response

    return {
      messages: response.data.messages || [], // Ensure messages are always an array
      nextPage: response.data.hasNextPage ? pageParam + 1 : null,
    };
  } catch (error: any) {
    console.error('Error fetching chat data:', error.response || error);
    throw error;
  }
};

export const useGetMessages = (
  userObjId: string,
  limit: number = 10,
  searchValue: string = '',
) => {
  return useInfiniteQuery({
    queryKey: ['chatData', userObjId, limit, searchValue],
    queryFn: ({pageParam = 1}) =>
      getMessages({pageParam, userObjId, limit, searchValue}),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
    enabled: !!userObjId,
    getNextPageParam: lastPage => lastPage.nextPage || undefined,
    select: data => ({
      messages: data.pages.flatMap(page => page.messages), // Ensure messages are extracted properly
      hasNextPage: data.pages.some(page => page.nextPage !== null),
    }),
  });
};

export const getRecentChats = async (searchValue = '') => {
  try {
    const {data} = await API_AXIOS.get(`/chat/recents`, {
      params: {searchValue},
    });
    return data;
  } catch (error: any) {
    console.error('Error fetching recent chats:', error.response || error);
    throw error;
  }
};

export const uesGetRecentChats = (searchValue = '') => {
  return useQuery({
    queryKey: ['recentChats', searchValue],
    queryFn: () => getRecentChats(searchValue),
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });
};

export const deleteChatWithUser = async (oppositeUserId: string) => {
  try {
    const {data} = await API_AXIOS.delete(`/chat/all/${oppositeUserId}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting full chat:', error.response || error);
    throw error;
  }
};

export const deleteMessagesByIds = async (messageIds: string[]) => {
  try {
    const params = new URLSearchParams();
    messageIds.forEach(id => params.append('id', id));
    const {data} = await API_AXIOS.delete(`/chat/?${params.toString()}`);
    return data;
  } catch (error: any) {
    console.error('Error deleting messages:', error.response || error);
    throw error;
  }
};
