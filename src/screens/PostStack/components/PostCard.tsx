import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableWithoutFeedback,
} from 'react-native';
import Carousel from 'react-native-reanimated-carousel';
import CustomAvatar from '../../../components/CustomAvatar';
import CustomText from '../../../components/CustomText';
import {Gesture, GestureDetector} from 'react-native-gesture-handler';
import {runOnJS} from 'react-native-reanimated';
import FullStoryModal from '../../../components/Modals/FullStoryModal';
import CommentsModal from '../../../components/Modals/CommentsModal';

const {width: screenWidth} = Dimensions.get('window');

const PostCard = ({post}: any) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showOptions, setShowOptions] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [viewFullStory, setViewFullStory] = useState<boolean>(false);
  const [commentModal, setCommentModal] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);

  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View
        style={[
          styles.header,
          {
            backgroundColor: '#fff',
            borderTopWidth: 0.8,
            borderColor: '#ddd',
          },
        ]}>
        <CustomAvatar name={'lksjd'} />
        <CustomText style={styles.username}>{post.user.name}</CustomText>
        <CustomText style={styles.mention}> @{post.mention}</CustomText>
        <TouchableOpacity
          style={styles.dots}
          onPress={() => setShowOptions(true)}>
          <Image
            source={require('../../../assets/icons/verThreeDots.png')}
            style={{height: 20, width: 20}}
            tintColor={'grey'}
          />
        </TouchableOpacity>
      </View>

      {/* MEDIA CAROUSEL */}
      <Carousel
        data={post.media}
        width={screenWidth}
        height={360}
        pagingEnabled
        onSnapToItem={index => setActiveIndex(index)}
        renderItem={({item}) => {
          const handleDoubleTapLike = () => {
            if (!liked) {
              setLiked(true);
              setLikeCount(prev => prev + 1);
            }
          };

          const doubleTap = Gesture.Tap()
            .numberOfTaps(2)
            .onStart(() => {
              runOnJS(handleDoubleTapLike)();
            });

          const singleTap = Gesture.Tap()
            .numberOfTaps(1)
            .maxDelay(250) // Wait to see if a second tap comes
            .onStart(() => {
              runOnJS(setViewFullStory)(true);
            });

          const composed = Gesture.Exclusive(doubleTap, singleTap);

          return (
            <GestureDetector gesture={composed}>
              <View>
                <Image
                  source={{uri: item.uri}}
                  style={styles.media}
                  resizeMode="cover"
                />
              </View>
            </GestureDetector>
          );
        }}
      />

      {/* PAGINATION & SPEAKER */}
      <View style={styles.bottomOverlay}>
        <View style={styles.dotsRow}>
          {post.media.map((_: any, i: number) => (
            <View
              key={i}
              style={[styles.dot, {opacity: i === activeIndex ? 1 : 0.3}]}
            />
          ))}
        </View>
        <TouchableOpacity
          style={{
            paddingLeft: 8,
            paddingVertical: 4,
          }}
          onPress={() => setSoundOn(!soundOn)}>
          <Image
            source={
              soundOn
                ? require('../../../assets/icons/speakerOn.png')
                : require('../../../assets/icons/speakerOff.png')
            }
            style={styles.speakerIcon}
          />
        </TouchableOpacity>
      </View>

      {/* FOOTER */}
      <View style={styles.footer}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <TouchableOpacity
            onPress={() => {
              setLiked(prev => !prev);
              setLikeCount(prev => (liked ? prev - 1 : prev + 1));
            }}>
            <Image
              source={
                liked
                  ? require('../../../assets/icons/heartFilled.png')
                  : require('../../../assets/icons/heartOutline.png')
              }
              style={styles.icon}
            />
          </TouchableOpacity>
          <CustomText style={{alignSelf: 'center'}}>{likeCount}</CustomText>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: 6}}>
          <TouchableOpacity onPress={() => setCommentModal(true)}>
            <Image
              source={require('../../../assets/icons/message.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <CustomText style={{alignSelf: 'center'}}>{0}</CustomText>
        </View>
        <TouchableOpacity>
          <Image
            source={require('../../../assets/icons/share.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <TouchableOpacity style={{marginLeft: 'auto'}}>
          <Image
            source={require('../../../assets/icons/save.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
      </View>
      <FullStoryModal
        visible={viewFullStory}
        onClose={() => setViewFullStory(false)}
        media={post.media}
        initialIndex={activeIndex}
      />

      <Modal visible={showOptions} transparent animationType="slide">
        <TouchableWithoutFeedback onPress={() => setShowOptions(false)}>
          <View style={styles.modal}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <View style={styles.modalBox}>
                <TouchableOpacity style={{padding: 12}}>
                  <CustomText>About this account</CustomText>
                </TouchableOpacity>
                <TouchableOpacity style={{padding: 12}}>
                  <CustomText>Report</CustomText>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <CommentsModal
        visible={commentModal}
        onClose={() => setCommentModal(false)}
      />
    </View>
  );
};

export default PostCard;

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  username: {
    fontWeight: '600',
    marginLeft: 10,
    fontSize: 14,
  },
  mention: {
    marginLeft: 4,
    color: 'gray',
    fontSize: 13,
  },
  dots: {
    marginLeft: 'auto',
    padding: 5,
  },
  media: {
    width: screenWidth,
    height: 360,
  },
  bottomOverlay: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: -30,
    paddingHorizontal: 20,
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#fff',
  },
  speakerIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  footer: {
    flexDirection: 'row',
    padding: 10,
    gap: 24,
    marginTop: 12,
    marginLeft: 8,
  },
  icon: {
    width: 24,
    height: 24,
  },
  modal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#00000070',
  },
  modalBox: {
    backgroundColor: '#fff',
    padding: 20,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
});
