import React from 'react';
import {FlatList, View} from 'react-native';
import MessageComponent from './MessageComponent';
import CustomText from '../../../components/CustomText';
import {chatScreenStyles} from '../../../sharedStyles';

const ChatMessagesList = ({
  messages,
  senderId,
  selectedMessages,
  onToggleSelect,
  onEndReached,
  keyboardHeight,
  flatListRef,
  page,
}: any) => (
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
          onToggleSelect={onToggleSelect}
        />
      ) : (
        <View>
          <CustomText>No message</CustomText>
        </View>
      )
    }
    ListFooterComponent={
      <View style={{height: keyboardHeight ? keyboardHeight + 20 : 20}} />
    }
    onEndReached={() => onEndReached(page + 1)}
    onEndReachedThreshold={0.8}
  />
);

export default ChatMessagesList;
