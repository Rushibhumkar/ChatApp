import React from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Modal,
  Pressable,
} from 'react-native';
import {attachmentList} from '../../../const/data';
import {chatScreenStyles, myStyle} from '../../../sharedStyles';
import CustomModal from '../../../components/CustomModal';
import CustomText from '../../../components/CustomText';

type Props = {
  visible: boolean;
  onClose: () => void;
  onPickFile: () => void;
};

const AttachmentOptionsModal: React.FC<Props> = ({
  visible,
  onClose,
  onPickFile,
}) => {
  return (
    <CustomModal
      visible={visible}
      onClose={onClose}
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
              if (item.label === 'Gallery') {
                onPickFile();
              }
              // Add more conditions here for other options if needed
            }}>
            <Image source={item.icon} style={chatScreenStyles.attachmentIcon} />
            <CustomText style={chatScreenStyles.attachmentText}>
              {item.label}
            </CustomText>
          </TouchableOpacity>
        ))}
      </View>
    </CustomModal>
  );
};

export default AttachmentOptionsModal;
