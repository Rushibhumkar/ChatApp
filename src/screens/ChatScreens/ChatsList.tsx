import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Image,
} from 'react-native';
import MainContainer from '../../components/MainContainer';
import {chatRoute} from '../AuthScreens/routeName';
import CustomAvatar from '../../components/CustomAvatar';
import {color} from '../../const/color';
import {useGetCombinedFollowData} from '../../api/follow/followFunc';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {io, Socket} from 'socket.io-client';
import {useGetMyData} from '../../api/profile/profileFunc';
import {getData} from '../../hooks/useAsyncStorage';
import {SOCKET_SERVER_URL} from '../../api/axiosInstance';
import {uesGetRecentChats} from '../../api/chats/chatFunc';
import {sizes} from '../../const';
import {getLastSeen} from '../../utils/commonFunction';
import {myConsole} from '../../utils/myConsole';

const ChatsList = ({navigation}: any) => {
  const [refreshing, setRefreshing] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const {data: myData} = useGetMyData();
  const senderId = myData?.data?._id;
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Array<any>>([]);

  useEffect(() => {
    socketSetup();
  }, []);

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

    newSocket.on('error', (err: any) => {
      console.log({event: 'error', message: err});
    });

    newSocket.on('register', (res: any) => {
      console.log({event: 'register', message: res});
    });
  };

  const {
    data: combinedData,
    isLoading,
    isError,
    refetch,
  } = useGetCombinedFollowData(searchValue);

  const {
    data: recentChats,
    isLoading: recentChatsLoad,
    isError: recentChatsErr,
    refetch: recentChatsRefetch,
  } = uesGetRecentChats('');

  const onRefresh = () => {
    setRefreshing(true);
    refetch();
    recentChatsRefetch();
    setTimeout(() => setRefreshing(false), 1000);
  };

  return (
    <MainContainer
      title="Chats"
      // removeFlexProp={true}
      bgColor={'#fff'}
      showRightIcon={[
        ...(recentChats?.data?.chats?.length > 0
          ? [
              {
                imageSource: require('../../assets/animatedIcons/search.png'),
                onPress: () => navigation.navigate(chatRoute.ChatsSearchScreen),
              },
            ]
          : []),
      ]}>
      {recentChatsLoad ? (
        <LoadingCompo minHeight={sizes.height / 1.1} />
      ) : isError ? (
        <CustomErrorMessage
          message="Failed to fetch chats. Please try again."
          onRetry={refetch}
        />
      ) : recentChats?.data?.chats?.length > 0 ? (
        <FlatList
          data={[...recentChats.data.chats].sort(
            (a, b) =>
              new Date(b.receiver.updatedAt).getTime() -
              new Date(a.receiver.updatedAt).getTime(),
          )}
          keyExtractor={item => item._id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          contentContainerStyle={{paddingBottom: 20}}
          style={{backgroundColor: '#fff'}}
          renderItem={({item}) => (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() =>
                navigation.navigate(chatRoute.ChattingScreen, {
                  data: item,
                  dsss: socket,
                })
              }>
              <CustomAvatar
                imgUrl={item?.receiver?.profileImageUrl}
                imgStyle={{height: 52, width: 52}}
                name={`${item.receiver.firstName} ${item.receiver.lastName}`}
                style={styles.avatar}
              />
              <View style={styles.chatContent}>
                <Text style={styles.chatName}>
                  {`${item?.receiver?.firstName || ''} ${
                    item?.receiver?.lastName || ''
                  }`}
                </Text>
                <Text style={styles.lastMessage}>
                  {getLastSeen(item?.receiver?.updatedAt)}
                </Text>
              </View>
            </TouchableOpacity>
          )}
        />
      ) : (
        <View style={styles.noDataContainer}>
          <Image
            source={require('../../assets/icons/fired.png')}
            style={styles.noDataIcon}
            tintColor={color.placeholderColor}
          />
          <Text style={styles.noDataText}>No chats found.</Text>
        </View>
      )}
    </MainContainer>
  );
};

export default ChatsList;

const styles = StyleSheet.create({
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  chatContent: {
    flex: 1,
    marginLeft: 10,
  },
  chatName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  lastMessage: {
    fontSize: 14,
    color: '#666',
  },
  noDataContainer: {
    height: sizes.height,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  noDataIcon: {
    height: 40,
    width: 40,
    marginTop: -200,
  },
  noDataText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#888',
  },
});
