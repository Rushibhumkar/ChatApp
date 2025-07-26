import React from 'react';
import {View, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {chatScreenStyles, myStyle} from '../../../sharedStyles';
import CustomText from '../../../components/CustomText';

interface EmptyChatPlaceholderProps {
  onSendHi: () => void;
  onEmojiPress: () => void;
}

const EmptyChatPlaceholder: React.FC<EmptyChatPlaceholderProps> = ({
  onSendHi,
  onEmojiPress,
}) => {
  return (
    <View style={myStyle.flexCenter}>
      <CustomText style={{fontSize: 16, marginBottom: 10}}>
        No messages yet
      </CustomText>
      <TouchableOpacity onPress={onEmojiPress}>
        <Image
          source={require('../../../assets/icons/emoji.png')}
          style={{width: 40, height: 40, marginBottom: 10}}
        />
      </TouchableOpacity>
      <TouchableOpacity style={chatScreenStyles.sendHiMsg} onPress={onSendHi}>
        <CustomText style={{color: '#FFF', fontSize: 16}}>Send Hi</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default EmptyChatPlaceholder;
