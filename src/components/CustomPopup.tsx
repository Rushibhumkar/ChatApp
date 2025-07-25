import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import {color} from '../const/color';

const {width, height} = Dimensions.get('window');

interface CustomPopupProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  buttonTitle?: string;
  onButtonClick?: () => void;
}

const CustomPopup: React.FC<CustomPopupProps> = ({
  visible,
  onClose,
  children,
  buttonTitle = 'Close',
  onButtonClick,
}) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.popupContainer}>
          <TouchableOpacity
            onPress={() => {
              onButtonClick?.();
              onClose();
            }}
            style={{
              alignSelf: 'flex-end',
              paddingBottom: 8,
              paddingLeft: 8,
              marginTop: 8,
            }}>
            <Image
              source={{
                uri: 'https://cdn-icons-png.flaticon.com/128/458/458595.png',
              }}
              width={18}
              height={18}
            />
          </TouchableOpacity>
          <View style={styles.content}>{children}</View>
          {/* <TouchableOpacity
            style={styles.button}
            onPress={() => {
              onButtonClick?.();
              onClose();
            }}>
            <Text style={styles.buttonText}>{buttonTitle}</Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popupContainer: {
    width: width * 0.8,
    paddingHorizontal: 20,
    paddingTop: 4,
    backgroundColor: 'white',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  content: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: color.deleteRed,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default CustomPopup;
