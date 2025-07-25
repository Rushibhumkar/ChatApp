import React from 'react';
import {
  Modal,
  View,
  Image,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import {chatScreenStyles} from '../../../sharedStyles';

interface CapturedImagePreviewModalProps {
  visible: boolean;
  imageUri: string;
  onClose: () => void;
  onSend: () => void;
  isSending?: boolean;
}

const CapturedImagePreviewModal: React.FC<CapturedImagePreviewModalProps> = ({
  visible,
  imageUri,
  onClose,
  onSend,
  isSending = false,
}) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}>
      <View style={chatScreenStyles.modalContainer}>
        <Image
          source={{uri: imageUri}}
          style={chatScreenStyles.capturedImage}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={onClose}
          style={chatScreenStyles.closeButton}>
          <Text style={{color: '#fff'}}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={onSend} style={chatScreenStyles.sendButton}>
          {isSending ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={{color: '#fff'}}>Send</Text>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
};

export default CapturedImagePreviewModal;
