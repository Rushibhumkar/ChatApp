import {API_AXIOS, SOCKET_SERVER_URL} from '../api/axiosInstance';
import Clipboard from '@react-native-clipboard/clipboard';
import {MsgDataType} from './typescriptInterfaces';
import {deleteMessagesByIds} from '../api/chats/chatFunc';
import {showSuccessToast, showErrorToast} from './toastModalFunction';

export const fetchMessages = async ({
  receiverId,
  page,
  isFetching,
  setMessages,
  setFetchError,
  setPage,
  setIsFetching,
}: {
  receiverId: string;
  page: number;
  isFetching: boolean;
  setMessages: React.Dispatch<React.SetStateAction<MsgDataType[]>>;
  setFetchError: React.Dispatch<React.SetStateAction<string | null>>;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setIsFetching: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  if (isFetching) return;
  setIsFetching(true);

  try {
    const response = await API_AXIOS.get(
      `${SOCKET_SERVER_URL}/api/chat/${receiverId}?limit=20&page=${page}`,
    );
    const newMessages = response.data?.data?.messages ?? [];

    if (page === 1) {
      setMessages(newMessages);
      setFetchError(null);
    } else {
      setMessages(prev => [...prev, ...newMessages]);
    }
    setPage(page);
  } catch (error: any) {
    if (error?.response?.status === 429) {
      console.error('Rate limit exceeded:', error);
      setFetchError(
        'You are sending too many requests. Please wait a moment and try again.',
      );
    } else {
      console.error('Failed to fetch messages:', error);
      setFetchError('Failed to load messages. Please try again.');
    }
  } finally {
    setIsFetching(false);
  }
};

export const sendMessagePayload = ({
  message,
  file,
  senderId,
  receiverId,
}: {
  message: string;
  file: any;
  senderId: string;
  receiverId: string;
}): MsgDataType => {
  return {
    sender: senderId,
    receiver: receiverId,
    text: message,
    ...(file?.attachments?.length ? {attachments: file.attachments} : {}),
  };
};

export const copyToClipboard = (text: string) => {
  Clipboard.setString(text);
  showSuccessToast({description: 'Copied to clipboard!'});
};

export const handleDeleteMessages = async (
  selectedMessages: MsgDataType[],
  setSelectedMessages: React.Dispatch<React.SetStateAction<MsgDataType[]>>,
  onRefresh: () => void,
) => {
  try {
    await deleteMessagesByIds(selectedMessages.map((msg: any) => msg?._id));
    setSelectedMessages([]);
    onRefresh();
    showSuccessToast({
      description: 'Message(s) are deleted successfully!',
    });
  } catch (err) {
    showErrorToast({
      description: 'Failed to delete messages',
    });
  }
};
