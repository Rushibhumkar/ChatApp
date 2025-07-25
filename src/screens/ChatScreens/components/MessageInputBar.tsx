import React from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {chatScreenStyles} from '../../../sharedStyles';

interface MessageInputBarProps {
  message: string;
  onChangeMessage: (text: string) => void;
  onSendMessage: () => void;
  onAttachmentPress: () => void;
}

const MessageInputBar: React.FC<MessageInputBarProps> = ({
  message,
  onChangeMessage,
  onSendMessage,
  onAttachmentPress,
}) => {
  return (
    <View style={chatScreenStyles.inputContainer}>
      <View style={chatScreenStyles.mainInputCont}>
        <TextInput
          style={chatScreenStyles.input}
          placeholder="Enter text..."
          placeholderTextColor="#999"
          value={message}
          onChangeText={onChangeMessage}
        />

        <TouchableOpacity onPress={onAttachmentPress}>
          <Image
            source={require('../../../assets/icons/attachments.png')}
            style={chatScreenStyles.icon}
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={chatScreenStyles.sendBtn}
        onPress={onSendMessage}>
        <Image
          tintColor={'#fff'}
          source={require('../../../assets/icons/sent.png')}
          style={chatScreenStyles.icon}
        />
      </TouchableOpacity>
    </View>
  );
};

export default MessageInputBar;
