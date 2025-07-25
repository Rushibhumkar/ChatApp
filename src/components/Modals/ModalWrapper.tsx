// components/Modals/ModalWrapper.tsx
import React, {ReactNode} from 'react';
import {
  Modal,
  StyleSheet,
  View,
  ViewStyle,
  StyleProp,
  TouchableOpacity,
  Image,
} from 'react-native';

interface Props {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
}

const ModalWrapper = ({visible, onClose, children, containerStyle}: Props) => {
  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      statusBarTranslucent>
      <View style={styles.modalBackground}>
        <View style={[styles.modalContent, containerStyle]}>
          <TouchableOpacity style={styles.close} onPress={onClose}>
            <Image
              source={require('../../assets/icons/close.png')}
              style={{height: 16, width: 16}}
            />
          </TouchableOpacity>
          {children}
        </View>
      </View>
    </Modal>
  );
};

export default ModalWrapper;

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
  modalContent: {
    flex: 1,
    backgroundColor: '#000',
  },
  close: {
    position: 'absolute',
    top: 40,
    right: 20,
    zIndex: 1,
  },
});
