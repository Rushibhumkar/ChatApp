import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import CustomModal from '../../../components/CustomModal';
import CustomAvatar from '../../../components/CustomAvatar';
import {color} from '../../../const/color';
import {uesGetRecentChats} from '../../../api/chats/chatFunc';
import {myConsole} from '../../../utils/myConsole';
import CustomText from '../../../components/CustomText';
import {useNavigation} from '@react-navigation/native';
import {chatRoute} from '../../AuthScreens/routeName';

const CustomForwardModal = ({
  visible,
  onClose,
  selectedMessages,
}: {
  visible: boolean;
  onClose: () => void;
  selectedMessages: any[];
}) => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  const {
    data: recentChats,
    isLoading: recentChatsLoad,
    isError: recentChatsErr,
    refetch: recentChatsRefetch,
  } = uesGetRecentChats('');

  const filteredChats =
    recentChats?.data?.chats?.filter((chat: any) =>
      `${chat.receiver.firstName} ${chat.receiver.lastName}`
        .toLowerCase()
        .includes(searchText.toLowerCase()),
    ) || [];

  const handleToggleUser = (userId: string) => {
    setSelectedUsers(prev => (prev.includes(userId) ? [] : [userId]));
  };

  const handleSend = () => {
    // myConsole('Forwarding messages:', selectedMessages);
    // myConsole('To users:', selectedUsers);

    if (selectedUsers.length > 0 && selectedMessages.length > 0) {
      onClose();

      navigation.navigate(chatRoute.ChattingScreen, {
        forwardedToUserId: selectedUsers[0],
        forwardedMessages: selectedMessages,
      });
    }
  };

  return (
    <CustomModal visible={visible} onClose={onClose}>
      <View style={{padding: 12}}>
        {/* Search Bar */}
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 10,
            borderWidth: 1,
            borderColor: '#ccc',
            borderRadius: 8,
            paddingHorizontal: 10,
          }}>
          <TextInput
            placeholder="Search users..."
            value={searchText}
            onChangeText={setSearchText}
            style={{
              flex: 1,
              color: color.titleColor,
              height: 40,
            }}
            placeholderTextColor={'grey'}
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <Image
                source={require('../../../assets/icons/close.png')}
                style={{width: 12, height: 12, marginLeft: 8}}
                tintColor={'grey'}
              />
            </TouchableOpacity>
          )}
        </View>

        {/* User List */}
        {recentChatsLoad ? (
          <ActivityIndicator size="small" color={color.mainColor} />
        ) : recentChatsErr ? (
          <Text style={{color: 'red'}}>Failed to load users.</Text>
        ) : (
          <FlatList
            data={filteredChats}
            keyExtractor={item => item.receiver._id}
            style={{maxHeight: 300}}
            renderItem={({item}) => {
              const isSelected = selectedUsers.includes(item.receiver._id);
              myConsole('item', item);
              return (
                <TouchableOpacity
                  onPress={() => handleToggleUser(item.receiver._id)}
                  style={{
                    padding: 10,
                    backgroundColor: isSelected ? '#E0F7FA' : '#fff',
                    flexDirection: 'row',
                    alignItems: 'center',
                  }}>
                  <CustomAvatar
                    name={`${item.receiver.firstName} ${item.receiver.lastName}`}
                    imgUrl={item.receiver.profileImageUrl}
                    imgStyle={{
                      height: 30,
                      width: 30,
                    }}
                  />
                  <CustomText style={{marginLeft: 10}}>
                    {item.receiver.firstName} {item.receiver.lastName}
                  </CustomText>
                </TouchableOpacity>
              );
            }}
          />
        )}

        {/* Send Button */}
        <TouchableOpacity
          style={{
            marginTop: 16,
            backgroundColor:
              selectedUsers.length > 0 ? color.mainColor : '#ccc',
            padding: 12,
            borderRadius: 8,
            alignItems: 'center',
          }}
          disabled={selectedUsers.length === 0}
          onPress={handleSend}>
          <Text style={{color: '#fff', fontWeight: 'bold'}}>Send</Text>
        </TouchableOpacity>
      </View>
    </CustomModal>
  );
};

export default CustomForwardModal;
