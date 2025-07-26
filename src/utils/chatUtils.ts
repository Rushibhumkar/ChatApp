import {API_AXIOS, SOCKET_SERVER_URL} from '../api/axiosInstance';
import Clipboard from '@react-native-clipboard/clipboard';
import {MsgDataType} from './typescriptInterfaces';
import {deleteMessagesByIds as deleteFromServer} from '../api/chats/chatFunc';
import {showSuccessToast, showErrorToast} from './toastModalFunction';
import {
  insertMessage,
  deleteMessagesByIds as deleteFromLocalDB,
} from '../services/MessageService';

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
    const newMessages: MsgDataType[] = response.data?.data?.messages ?? [];

    // Store in local SQLite DB
    for (const msg of newMessages) {
      await insertMessage(msg);
    }

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
    _id: Date.now().toString(), // Temporary local ID
    sender: senderId,
    receiver: receiverId,
    text: message,
    attachments: file?.attachments || [],
    createdAt: new Date().toISOString(),
    isSynced: false,
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
    const ids = selectedMessages.map(msg => msg?._id);
    await deleteFromServer(ids); // server
    await deleteFromLocalDB(ids); // local
    setSelectedMessages([]);
    onRefresh();
    showSuccessToast({
      description: 'Message(s) deleted successfully!',
    });
  } catch (err) {
    showErrorToast({
      description: 'Failed to delete messages',
    });
  }
};
