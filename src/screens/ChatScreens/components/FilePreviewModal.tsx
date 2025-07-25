import React from 'react';
import {
  View,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {fileViewURL} from '../../../api/axiosInstance';
import CustomModal from '../../../components/CustomModal';
import {sizes} from '../../../const';
import {chatScreenStyles} from '../../../sharedStyles';
import CustomText from '../../../components/CustomText';
import Video from 'react-native-video';

interface FilePreviewModalProps {
  visible: boolean;
  onClose: () => void;
  file: any;
  message: string;
  onChangeMessage: (text: string) => void;
  onSend: () => void;
  keyboardHeight: number;
  toggleAttachmentPopup: () => void;
}

const FilePreviewModal: React.FC<FilePreviewModalProps> = ({
  visible,
  onClose,
  file,
  message,
  onChangeMessage,
  onSend,
  keyboardHeight,
  toggleAttachmentPopup,
}) => {
  const isVideo = file?.attachments?.[0]?.mimeType?.includes('video');
  const mediaUri = isVideo
    ? `${fileViewURL}${file?.attachments?.[0]?.path}`
    : file?.uri;

  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
      containerStyle={{
        height: keyboardHeight ? sizes.height / 2.5 : sizes.height / 1.2,
        marginTop: 40,
        width: sizes.width / 1.1,
      }}>
      <View style={{flex: 1, alignItems: 'center'}}>
        <CustomText style={chatScreenStyles.fileName}>
          {file?.fileName || 'Selected File'}
        </CustomText>

        {isVideo ? (
          <Video
            source={{uri: mediaUri}}
            style={{
              width: sizes.width / 1.2,
              height: keyboardHeight ? 180 : 400,
            }}
            resizeMode="contain"
            onError={() => console.log('Error loading video')}
            repeat={false}
          />
        ) : (
          <Image
            source={{uri: mediaUri}}
            style={{
              width: sizes.width / 1.2,
              height: keyboardHeight ? 180 : 600,
            }}
            resizeMode="contain"
          />
        )}

        <View
          style={[
            chatScreenStyles.inputContainer,
            {paddingHorizontal: 0, gap: 2},
          ]}>
          <View style={chatScreenStyles.mainInputCont}>
            <TextInput
              style={chatScreenStyles.input}
              placeholder="Enter text..."
              placeholderTextColor="#999"
              value={message}
              onChangeText={onChangeMessage}
            />
            <TouchableOpacity onPress={toggleAttachmentPopup}>
              <Image
                source={require('../../../assets/icons/attachments.png')}
                style={chatScreenStyles.icon}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[chatScreenStyles.sendBtn, {marginLeft: 4}]}
            onPress={onSend}>
            <Image
              tintColor={'#fff'}
              source={require('../../../assets/icons/sent.png')}
              style={chatScreenStyles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>
    </CustomModal>
  );
};

export default FilePreviewModal;
