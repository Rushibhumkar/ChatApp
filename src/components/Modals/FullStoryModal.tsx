import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import {myConsole} from '../../utils/myConsole';
import ModalWrapper from './ModalWrapper';
import CommentsModal from './CommentsModal';

type Props = {
  visible: boolean;
  onClose: () => void;
  media: {uri: string}[];
  initialIndex: number;
};

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

const FullStoryModal = ({visible, onClose, media, initialIndex}: Props) => {
  const [activeIndex, setActiveIndex] = useState(initialIndex);
  const [showOptions, setShowOptions] = useState(false);
  const [commentModal, setCommentModal] = useState<boolean>(false);

  return (
    <ModalWrapper
      visible={visible}
      onClose={onClose}
      containerStyle={{flex: 1}}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../assets/icons/back.png')}
              style={{height: 28, width: 28, tintColor: '#fff'}}
            />
          </TouchableOpacity>
          {/* <TouchableOpacity>
            <Image
              source={require('../../assets/icons/verThreeDots.png')}
              style={{height: 22, width: 22, tintColor: '#fff'}}
            />
          </TouchableOpacity> */}
        </View>

        {/* Carousel */}
        <Carousel
          data={media}
          width={screenWidth}
          height={screenHeight}
          pagingEnabled
          defaultIndex={initialIndex}
          onSnapToItem={index => setActiveIndex(index)}
          renderItem={({item}) => (
            <Image
              source={{uri: item.uri}}
              style={styles.fullImage}
              resizeMode="contain"
            />
          )}
        />

        {/* Floating Action Icons */}
        <View style={styles.iconStack}>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icons/heartOutline.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setCommentModal(true)}>
            <Image
              source={require('../../assets/icons/message.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../../assets/icons/share.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setShowOptions(true)}>
            <Image
              source={require('../../assets/icons/verThreeDots.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>

        {/* Bottom Sheet Modal */}
        <Modal visible={showOptions} transparent animationType="slide">
          <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
            <View style={styles.bottomSheetBackdrop}>
              <TouchableWithoutFeedback>
                <View style={styles.bottomSheet}>
                  <TouchableOpacity style={styles.sheetItem}>
                    <Image
                      source={require('../../assets/icons/save.png')}
                      style={styles.sheetIcon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.sheetItem}>
                    <Image
                      source={require('../../assets/icons/report.png')}
                      style={styles.sheetIcon}
                    />
                  </TouchableOpacity>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
      <CommentsModal
        visible={commentModal}
        onClose={() => setCommentModal(false)}
      />
    </ModalWrapper>
  );
};

export default FullStoryModal;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    width: screenWidth,
  },
  header: {
    position: 'absolute',
    top: 48,
    left: 20,
    right: 20,
    zIndex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  fullImage: {
    width: screenWidth,
    height: screenHeight,
  },
  iconStack: {
    position: 'absolute',
    bottom: 80,
    right: 16,
    alignItems: 'center',
    gap: 32,
  },
  icon: {
    width: 28,
    height: 28,
    tintColor: '#fff',
  },
  bottomSheetBackdrop: {
    flex: 1,
    backgroundColor: '#00000070',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    backgroundColor: '#fff',
    padding: 24,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  sheetItem: {
    alignItems: 'center',
  },
  sheetIcon: {
    width: 28,
    height: 28,
  },
});
