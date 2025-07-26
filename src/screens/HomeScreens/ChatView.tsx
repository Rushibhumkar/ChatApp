import React, {useState, useEffect, useCallback, useRef} from 'react';
import {
  View,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  Alert,
  FlatList,
} from 'react-native';
import MainContainer from '../../components/MainContainer';
import {useGetMyData} from '../../api/profile/profileFunc';
import {chatScreenStyles} from '../../sharedStyles';
import {useFocusEffect} from '@react-navigation/native';
import {MsgDataType} from '../../utils/typescriptInterfaces';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import EmptyChatPlaceholder from './components/EmptyChatPlaceholder';
import MessageInputBar from './components/MessageInputBar';
import FilePreviewModal from './components/FilePreviewModal';
import CustomForwardModal from './components/CustomForwardModal';
import MessageComponent from './components/MessageComponent';
import AttachmentOptionsModal from './components/AttachmentOptionsModal';
import ForwardedMessageEmitter from './components/ForwardedMessageEmitter';
import useSocket from '../../hooks/useSocket';
import {
  fetchMessages as fetchMessagesUtil,
  handleDeleteMessages as handleDeleteMessagesUtil,
  copyToClipboard,
  sendMessagePayload,
} from '../../utils/chatUtils';
import {getTextWithLength} from '../../utils/commonFunction';

const ChatView = ({navigation, route}: any) => {
  const {data, forwardedMessages, forwardedToUserId} = route.params || {};
  const {data: myData} = useGetMyData();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<MsgDataType[]>([]);
  const [attachmentsPopup, setAttachmentsPopup] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [imageViewModalVisible, setImageViewModalVisible] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [selectedMessages, setSelectedMessages] = useState<MsgDataType[]>([]);
  const [forwardModal, setForwardModal] = useState(false);
  const [page, setPage] = useState(1);
  const [isFetching, setIsFetching] = useState(false);

  const senderId = myData?.data?._id;
  const receiverId = data?._id;
  const flatListRef = useRef(null);

  const socket = useSocket({
    senderId,
    onMessageReceived: (msg: MsgDataType) => {
      setMessages(prev => [msg, ...prev]);
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (messages.length > 0) {
        const lastReceivedMessage: any = messages.find(
          msg => msg.sender !== senderId,
        );
        if (lastReceivedMessage && socket) {
          socket.emit('markSeenMessage', lastReceivedMessage?._id);
        }
      }
    }, [messages, socket]),
  );

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => {
        setKeyboardHeight(event.endCoordinates.height);
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

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = (nextPage = 1) =>
    fetchMessagesUtil({
      receiverId,
      page: nextPage,
      isFetching,
      setMessages,
      setFetchError,
      setPage,
      setIsFetching,
    });

  const sendMessage = () => {
    if (!message.trim()) return;
    const newMessage = sendMessagePayload({
      message,
      file,
      senderId,
      receiverId,
    });
    if (socket) socket.emit('sendMessage', newMessage);
    setMessage('');
    setFile(null);
    setImageViewModalVisible(false);
  };

  const handleDeleteMessages = () =>
    Alert.alert('Confirm Delete', 'Do you want to delete selected messages?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () =>
          handleDeleteMessagesUtil(selectedMessages, setSelectedMessages, () =>
            fetchMessages(1),
          ),
      },
    ]);

  const userFullName = `${data?.receiver?.firstName || data?.firstName || ''} ${
    data?.receiver?.lastName || data?.lastName || ''
  }`;

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
                      onPress: () =>
                        copyToClipboard(selectedMessages[0]?.text || ''),
                      size: 22,
                    },
                  ]
                : []),
            ]
          : undefined
      }
      isBack>
      <ForwardedMessageEmitter
        forwardedMessages={forwardedMessages}
        forwardedToUserId={forwardedToUserId}
        senderId={senderId}
        socket={socket}
      />

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
            keyExtractor={(item: any) => item?._id ?? 'defaultKey'}
            contentContainerStyle={[
              chatScreenStyles.chatArea,
              {paddingBottom: keyboardHeight || 20},
            ]}
            keyboardShouldPersistTaps="handled"
            renderItem={({item}) => (
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
            )}
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

        <AttachmentOptionsModal
          visible={attachmentsPopup}
          onClose={() => setAttachmentsPopup(false)}
          onPickFile={async () => {
            const {pickFileHelper} = await import(
              './components/pickFileHelper'
            );
            pickFileHelper({
              onStartUpload: () => {
                setAttachmentsPopup(false);
                setImageViewModalVisible(true);
              },
              onSuccess: fileData => {
                setFile(fileData);
              },
            });
          }}
        />
      </KeyboardAvoidingView>
    </MainContainer>
  );
};

export default ChatView;
