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
import {myConsole} from '../../utils/myConsole';
import {chatScreenStyles, myStyle} from '../../sharedStyles';
import {getData} from '../../hooks/useAsyncStorage';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {attachmentList} from '../../const/data';
import {color} from '../../const/color';
import CustomModal from '../../components/CustomModal';
import CustomText from '../../components/CustomText';
import {MsgDataType} from '../../utils/typescriptInterfaces';
import {useFocusEffect} from '@react-navigation/native';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import MessageComponent from './components/MessageComponent';
import {CameraType} from 'react-native-camera-kit';
import RNFS from 'react-native-fs';
import {chatRoute, commonRoute} from '../AuthScreens/routeName';
import EmptyChatPlaceholder from './components/EmptyChatPlaceholder';
import MessageInputBar from './components/MessageInputBar';
import FilePreviewModal from './components/FilePreviewModal';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import {pickFileHelper} from './components/pickFileHelper';
import CameraCaptureView from './components/CameraCaptureView';
import {sendCapturedImageHelper} from './components/sendCapturedImageHelper';
import CapturedImagePreviewModal from './components/CapturedImagePreviewModal';
import CallModalBase from './components/CallModalBase';
import {getTextWithLength} from '../../utils/commonFunction';
import {deleteMessagesByIds} from '../../api/chats/chatFunc';
import CustomForwardModal from './components/CustomForwardModal';
import Clipboard from '@react-native-clipboard/clipboard';

const ChattingScreen = ({navigation, route}: any) => {
  const {data} = route.params;
  const {forwardedMessages, forwardedToUserId} = route.params || {};
  const {data: myData} = useGetMyData();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Array<any>>([]);
  const [attachmentsPopup, setAttachmentsPopup] = useState(false);
  const [socket, setSocket] = useState<Socket>();
  const [messageLoad, setMessageLoad] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [imageViewModalVisible, setImageViewModalVisible] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [sendCapturedImgLoad, setSendCapturedImgLoad] = useState(false);
  const [contact, setContact] = useState<MsgDataType['contact'] | undefined>();
  const [location, setLocation] = useState<
    MsgDataType['location'] | undefined
  >();

  const [cameraVisible, setCameraVisible] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraType, setCameraType] = useState(CameraType.Back);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [callingModal, setCallingModal] = useState<boolean>(false);
  const [videoCallModal, setVideoCallModal] = useState<boolean>(false);
  const [selectedMessages, setSelectedMessages] = useState<Array<MsgDataType>>(
    [],
  );

  const [forwardModal, setForwardModal] = useState<boolean>(false);
  const cameraRef = useRef(null);
  if (forwardedMessages && forwardedToUserId && socket) {
    forwardedMessages.forEach((msg: any) => {
      const forwardMsg: MsgDataType = {
        sender: senderId,
        receiver: forwardedToUserId,
        text: msg.text,
        ...(msg.attachments?.length ? {attachments: msg.attachments} : {}),
        ...(msg.contact ? {contact: msg.contact} : {}),
        ...(msg.location ? {location: msg.location} : {}),
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
    // return () => {
    //   if (socket) socket.disconnect();
    //   console.log('socket is disconnected');
    // };
  }, []);

  const flatListRef = useRef(null);

  const socketSetup = async () => {
    const newSocket = io(SOCKET_SERVER_URL, {
      transports: ['websocket'],
      query: {userId: senderId}, // Send userId when connecting
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
    if (!message.trim() && !file && !location && !contact) return;
    // myConsole('sldfjldksf', file);
    const newMessage: MsgDataType = {
      receiver: receiverId,
      text: message,
      sender: senderId,
      ...(file?.attachments && file.attachments.length > 0
        ? {attachments: file.attachments}
        : {}),
      ...(location &&
      location.latitude !== undefined &&
      location.longitude !== undefined
        ? {
            location: {
              latitude: location.latitude,
              longitude: location.longitude,
              ...(location.name ? {name: location.name} : {}),
              ...(location.address ? {address: location.address} : {}),
            },
          }
        : {}),
      ...(contact && contact.name && contact.phoneNumber
        ? {
            contact: {
              name: contact.name,
              phoneNumber: contact.phoneNumber,
              ...(contact.email ? {email: contact.email} : {}),
              ...(contact.profilePicture
                ? {profilePicture: contact.profilePicture}
                : {}),
            },
          }
        : {}),
    };

    if (socket) {
      socket.emit('sendMessage', newMessage);
    }
    setMessage('');
    setFile(null);
    setContact(undefined);
    setLocation(undefined);
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

  const pickContact = () => {
    setAttachmentsPopup(false);
    navigation.navigate(commonRoute.CommonStack, {
      screen: commonRoute.SelectContacts,
      params: {
        onContactSelect: (selectedContact: MsgDataType['contact']) => {
          // myConsole('Returned contact: ', selectedContact);
          setContact(selectedContact);
        },
      },
    });
  };

  const pickCamera = () => {
    setAttachmentsPopup(false);
    setCameraVisible(true); // Open the camera when this option is selected
  };

  const switchCamera = () => {
    setCameraType(prevType =>
      prevType === CameraType.Back ? CameraType.Front : CameraType.Back,
    );
  };

  const handleCapturedImage = async (uri: any) => {
    if (uri.startsWith('file://')) {
      const filePath = uri.replace('file://', '');
      const pathSegments = filePath.split('/');
      const fileName = pathSegments[pathSegments.length - 1];

      const destFilePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

      try {
        await RNFS.moveFile(filePath, destFilePath);
        const updatedUri = `file://${destFilePath}`;
        setCapturedImage(updatedUri); // Store the captured image URI
      } catch (error) {
        console.error('Error saving captured image:', error);
      }
    }
  };

  const sendCapturedImage = async (uri: string) => {
    sendCapturedImageHelper({
      uri,
      onSuccess: fileData => {
        setFile(fileData);
        setCameraVisible(false);
        setCapturedImage(null);
        sendMessage();
      },
      onError: () => {
        // optionally reset any states here
      },
    });
  };

  // myConsole('fielssss', file);
  const pickLocation = () => {
    setAttachmentsPopup(false);
    navigation.navigate(chatRoute.ChatStack, {
      screen: chatRoute.MapScreen,
      params: {
        onLocationSelect: (selectedLocation: MsgDataType['location']) => {
          // myConsole('Returned location: ', selectedLocation);
          setLocation(selectedLocation);
        },
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
              await deleteMessagesByIds(selectedMessages.map(msg => msg._id));

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

  useEffect(() => {
    if (contact) {
      sendMessage();
    }
  }, [contact]);

  useEffect(() => {
    if (location) {
      sendMessage();
    }
  }, [location]);
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
              {
                imageSource: require('../../assets/animatedIcons/forwardAni.png'),
                onPress: () => setForwardModal(true),
                size: 22,
              },
            ]
          : [
              {
                imageSource: require('../../assets/icons/video-call.png'),
                onPress: () => {
                  setVideoCallModal(true);
                },
                size: 28,
              },
              {
                imageSource: require('../../assets/icons/call.png'),
                onPress: () => {
                  setCallingModal(true);
                },
                color: color.mainColor,
                size: 20,
              },
              {
                imageSource: require('../../assets/icons/verThreeDots.png'),
                onPress: () => null,
                color: color.mainColor,
              },
            ]
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
        ) : messageLoad ? (
          <LoadingCompo />
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            inverted
            keyExtractor={item => item?._id ?? 'defaultKey'} // Use a default key if item or item._id is null/undefined
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
                      prev.some(m => m._id === msg._id)
                        ? prev.filter(m => m._id !== msg._id)
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

        {cameraVisible && (
          <CameraCaptureView
            cameraRef={cameraRef}
            cameraType={cameraType}
            switchCamera={switchCamera}
            onBack={() => setCameraVisible(false)}
            onCaptured={handleCapturedImage}
          />
        )}

        <CapturedImagePreviewModal
          visible={!!capturedImage}
          imageUri={capturedImage || ''}
          onClose={() => setCapturedImage(null)}
          onSend={() => sendCapturedImage(capturedImage)}
          isSending={sendCapturedImgLoad}
        />
        <CallModalBase
          visible={videoCallModal}
          onClose={() => setVideoCallModal(false)}
          userName={userFullName}
          avatarUrl={data?.profilePicture}
          showVideoToggle={true}
        />

        <CallModalBase
          visible={callingModal}
          onClose={() => setCallingModal(false)}
          userName={userFullName}
          avatarUrl={data?.profilePicture}
          showVideoToggle={false}
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
                  if (item.label === 'Camera')
                    pickCamera(); // Open camera when clicked
                  else if (item.label === 'Gallery') pickFile();
                  else if (item.label === 'Location') pickLocation();
                  else if (item.label === 'Contact') pickContact();
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

export default ChattingScreen;
