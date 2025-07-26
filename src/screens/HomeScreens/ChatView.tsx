import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
} from 'react-native';
import MainContainer from '../../components/MainContainer';
import {useGetMyData} from '../../api/profile/profileFunc';
import io, {Socket} from 'socket.io-client';
import {API_AXIOS, SOCKET_SERVER_URL} from '../../api/axiosInstance';
import {chatScreenStyles, myStyle} from '../../sharedStyles';
import {getData} from '../../hooks/useAsyncStorage';
import {attachmentList} from '../../const/data';
import CustomModal from '../../components/CustomModal';
import CustomText from '../../components/CustomText';
import {useFocusEffect} from '@react-navigation/native';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import EmptyChatPlaceholder from './components/EmptyChatPlaceholder';
import MessageInputBar from './components/MessageInputBar';
import FilePreviewModal from './components/FilePreviewModal';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {pickFileHelper} from './components/pickFileHelper';
import {getTextWithLength} from '../../utils/commonFunction';
import {deleteMessagesByIds} from '../../api/chats/chatFunc';
import CustomForwardModal from './components/CustomForwardModal';
import Clipboard from '@react-native-clipboard/clipboard';
import {MsgDataType} from '../../utils/typescriptInterfaces';
import MessageComponent from './components/MessageComponent';

const ChatView = ({navigation, route}: any) => {
  const {data} = route.params;
  const {forwardedMessages, forwardedToUserId} = route.params || {};
  const {data: myData} = useGetMyData();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<any>>([]);
  const [attachmentsPopup, setAttachmentsPopup] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [imageViewModalVisible, setImageViewModalVisible] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<Array<MsgDataType>>(
    [],
  );

  const [forwardModal, setForwardModal] = useState<boolean>(false);
  if (forwardedMessages && forwardedToUserId && socket) {
    forwardedMessages.forEach((msg: any) => {
      const forwardMsg: MsgDataType = {
        sender: senderId,
        receiver: forwardedToUserId,
        text: msg.text,
        ...(msg.attachments?.length ? {attachments: msg.attachments} : {}),
      };
      socket.emit('sendMessage', forwardMsg);
    });
    showSuccessToast({description: 'Message forwarded successfully!'});
  }

  useFocusEffect(
    useCallback(() => {
      if (messages.length > 0) {
        const lastReceivedMessage = messages.find(
          msg => msg.sender !== senderId,
        );
        // myConsole('lastReceivedMessage', lastReceivedMessage);
        if (lastReceivedMessage && socket) {
          socket.emit('markSeenMessage', lastReceivedMessage._id);
        }
      }
    }, [messages, socket]),
  );
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
        // console.log('Keyboard Height:', event.endCoordinates.height);
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardHeight(0);
      },
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const senderId = myData?.data?._id;
  const receiverId = data?._id;
  useEffect(() => {
    fetchMessages();
    socketSetup();
    return () => {
      if (socket) socket.disconnect();
      console.log('socket is disconnected');
    };
  }, []);

  const flatListRef = useRef(null);

  const socketSetup = async () => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: {userId: senderId},
    });

    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to socket server');
    });

    const token = await getData('authToken');
    newSocket.emit('register', senderId, token);

    newSocket.on('getMessage', (newMessage: any) => {
      setMessages((prevMessages: any) => [newMessage, ...prevMessages]);
    });

    newSocket.emit('markSeenMessage', messages[0]?._id);

    newSocket.on('error', (newMessage: any) => {
      console.log({event: 'error', message: newMessage});
    });
    newSocket.on('register', (newMessage: any) => {
      console.log({event: 'register', message: newMessage});
    });
  };

  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const fetchMessages = async (nextPage = 1) => {
    if (isFetching) return;
    setIsFetching(true);

    try {
      const response = await API_AXIOS.get(
        `${SOCKET_SERVER_URL}/api/chat/${receiverId}?limit=20&page=${nextPage}`,
      );
      const newMessages = response.data.data.messages ?? [];
      if (nextPage === 1) {
        setMessages(newMessages);
        setFetchError(null);
      } else {
        setMessages(prevMessages => [...prevMessages, ...newMessages]);
      }
      setPage(nextPage);
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

  const sendMessage = (): void => {
    if (!message.trim()) return;
    // myConsole('sldfjldksf', file);
    const newMessage: MsgDataType = {
      receiver: receiverId,
      text: message,
      sender: senderId,
      ...(file?.attachments && file.attachments.length > 0
        ? {attachments: file.attachments}
        : {}),
    };

    if (socket) {
      socket.emit('sendMessage', newMessage);
    }
    setMessage('');
    setFile(null);
    setImageViewModalVisible(false);
  };

  const pickFile = async () => {
    pickFileHelper({
      onStartUpload: () => {
        setAttachmentsPopup(false);
        setImageViewModalVisible(true);
      },
      onSuccess: fileData => {
        setFile(fileData);
      },
    });
  };

  const handleDeleteMessages = () => {
    Alert.alert(
      'Confirm Delete',
      'Do you want to delete selected messages?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            try {
              await deleteMessagesByIds(
                selectedMessages.map((msg: any) => msg?._id),
              );

              setSelectedMessages([]);
              fetchMessages(1);
              showSuccessToast({
                description: 'Message(s) are deleted successfully!',
              });
            } catch (err) {
              showErrorToast({
                description: 'Failed to delete messages',
              });
            }
          },
          style: 'destructive',
        },
      ],
      {cancelable: true},
    );
  };

  const copyMessageToClipboard = () => {
    console.log('skdfld');
    if (selectedMessages.length === 1) {
      Clipboard.setString(selectedMessages[0]?.text || '');
      showSuccessToast({description: 'Copied to clipboard!'});
    }
  };

  const userFullName = `${data?.receiver?.firstName || data?.firstName || ''} ${
    data?.receiver?.lastName || data?.lastName || ''
  }`;
  // myConsole('selectedMessages', selectedMessages);
  // myConsole('messages', messages);
  return (
    <MainContainer
      title={
        selectedMessages.length > 0
          ? ''
          : getTextWithLength(userFullName.trim(), 14) || 'Chat'
      }
      showAvatar={
        selectedMessages.length > 0
          ? ''
          : (data?.receiver?.firstName || data?.firstName) && userFullName
      }
      showRightTxt={selectedMessages.length > 0 ? selectedMessages.length : ''}
      showRightIcon={
        selectedMessages.length > 0
          ? [
              {
                imageSource: require('../../assets/animatedIcons/deleteAni.png'),
                onPress: handleDeleteMessages,
                size: 22,
              },
              ...(selectedMessages.length === 1
                ? [
                    {
                      imageSource: require('../../assets/animatedIcons/copyAni.png'),
                      onPress: copyMessageToClipboard,
                      size: 22,
                    },
                  ]
                : []),
              // {
              //   imageSource: require('../../assets/animatedIcons/forwardAni.png'),
              //   onPress: () => setForwardModal(true),
              //   size: 22,
              // },
            ]
          : undefined
      }
      isBack>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={
          Platform.OS === 'ios' ? 90 : keyboardHeight / 2 - 44
        }
        style={chatScreenStyles.container}>
        {fetchError ? (
          <CustomErrorMessage
            message={fetchError}
            onRetry={() => fetchMessages(1)}
          />
        ) : messages.length === 0 && !isFetching ? (
          <EmptyChatPlaceholder
            onEmojiPress={() => setMessage(prev => prev + '😊')}
            onSendHi={() => {
              setMessage('Hi');
              sendMessage();
            }}
          />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={item => item?._id ?? 'defaultKey'}
            contentContainerStyle={[
              chatScreenStyles.chatArea,
              {paddingBottom: keyboardHeight || 20},
            ]}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) =>
              item ? (
                <MessageComponent
                  data={item}
                  senderId={senderId}
                  selectedMessages={selectedMessages}
                  onToggleSelect={(msg: any) => {
                    setSelectedMessages(prev =>
                      prev.some((m: any) => m._id === msg._id)
                        ? prev.filter((m: any) => m._id !== msg._id)
                        : [...prev, msg],
                    );
                  }}
                />
              ) : (
                <View>
                  <CustomText>No message</CustomText>
                </View>
              )
            }
            ListFooterComponent={
              <View
                style={{height: keyboardHeight ? keyboardHeight + 20 : 20}}
              />
            }
            onEndReached={() => fetchMessages(page + 1)}
            onEndReachedThreshold={0.8}
          />
        )}
        {!fetchError && (
          <MessageInputBar
            message={message}
            onChangeMessage={setMessage}
            onSendMessage={sendMessage}
            onAttachmentPress={() => setAttachmentsPopup(!attachmentsPopup)}
          />
        )}

        <FilePreviewModal
          visible={imageViewModalVisible}
          onClose={() => setImageViewModalVisible(false)}
          file={file}
          message={message}
          onChangeMessage={setMessage}
          onSend={sendMessage}
          keyboardHeight={keyboardHeight}
          toggleAttachmentPopup={() => setAttachmentsPopup(!attachmentsPopup)}
        />

        <CustomForwardModal
          visible={forwardModal}
          onClose={() => setForwardModal(false)}
          selectedMessages={selectedMessages}
        />

        <CustomModal
          visible={attachmentsPopup}
          onClose={() => setAttachmentsPopup(false)}
          containerStyle={chatScreenStyles.attachmentContStyle}
          customBgStyle={{
            justifyContent: 'flex-end',
          }}>
          <View style={myStyle.rowAround}>
            {attachmentList.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={chatScreenStyles.attachmentItem}
                onPress={() => {
                  if (item.label === 'Gallery') pickFile();
                }}>
                <Image
                  source={item.icon}
                  style={chatScreenStyles.attachmentIcon}
                />
                <CustomText style={chatScreenStyles.attachmentText}>
                  {item.label}
                </CustomText>
              </TouchableOpacity>
            ))}
          </View>
        </CustomModal>
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ChatView;
