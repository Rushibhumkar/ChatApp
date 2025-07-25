import React, {ReactNode} from 'react';
import {
  Modal,
  TouchableWithoutFeedback,
  View,
  StyleSheet,
  TouchableOpacity,
  GestureResponderEvent,
  Image,
} from 'react-native';
import {sizes} from '../const';

interface CustomBottomModalProps {
  visible: boolean;
  onClose: (event?: GestureResponderEvent) => void;
  children: ReactNode;
  modalHeight?: number;
  backgroundColor?: string;
}

const CustomBottomModal: React.FC<CustomBottomModalProps> = ({
  visible,
  onClose,
  children,
  modalHeight = 400,
  backgroundColor = '#fff',
}) => {
  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay} />
      </TouchableWithoutFeedback>
      {/* <TouchableOpacity style={{padding: 4, backgroundColor: 'red'}}>
       
      </TouchableOpacity> */}
      <View
        style={[styles.modalContainer, {backgroundColor, height: modalHeight}]}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Image
            source={require('../assets/icons/close.png')}
            style={{height: 18, width: 18}}
            tintColor={'#fff'}
          />
        </TouchableOpacity>
        {children}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  modalContainer: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 32,
    paddingHorizontal: 16,
    elevation: 10,
    minHeight: 300,
    maxHeight: sizes.height * 0.84,
  },
  closeButton: {
    position: 'absolute',
    alignSelf: 'center',
    top: -50,
    backgroundColor: '#00000040',
    zIndex: 10,
    padding: 12,
    borderRadius: 50,
  },
});

export default CustomBottomModal;
