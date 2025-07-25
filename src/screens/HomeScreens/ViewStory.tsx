import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  PanResponder,
  BackHandler,
  Animated,
} from 'react-native';
import React, {useEffect, useRef, useState, useCallback} from 'react';
import MainContainer from '../../components/MainContainer';
import {color} from '../../const/color';
import {formatTime24Hour, getTextWithLength} from '../../utils/commonFunction';
import {fileViewURL} from '../../api/axiosInstance';
import {myConsole} from '../../utils/myConsole';
import {useGetMyData} from '../../api/profile/profileFunc';
import {useGetUserById} from '../../api/user/userFunc';
import {deleteStory, markStoryAsSeen} from '../../api/story/storyFunc';
import CustomErrorMessage from '../../components/CustomErrorMessage';
import Video from 'react-native-video';
import CustomBottomModal from '../../components/CustomBottomModal';
import {myStyle, row, shadow} from '../../sharedStyles';
import CustomText from '../../components/CustomText';
import {
  popUpConfToast,
  showErrorToast,
  showSuccessToast,
} from '../../utils/toastModalFunction';
import {useQueryClient} from '@tanstack/react-query';
import {sizes} from '../../const';

const {width, height} = Dimensions.get('window');

const ViewStory = ({route, navigation}: any) => {
  const {data, user} = route.params;
  myConsole('lkjslkdfsdf', data);
  const {data: myData} = useGetMyData();
  const {
    data: userData,
    isLoading: userLoading,
    isError: userErr,
  } = useGetUserById(data[0]?.user?._id || user?._id);

  const queryClient = useQueryClient();

  const [showViewsModal, setShowViewsModal] = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [isViewsModalVisible, setIsViewsModalVisible] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);

  const flatListRef = useRef<FlatList>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isMe = myData?.data?._id === data[0]?.user?._id;
  const progressAnim = useRef(new Animated.Value(0)).current;
  const animatedSec = 10000; // 10 seconds for image stories
  const handleCloseStory = useCallback(() => {
    progressAnim.stopAnimation();
    progressAnim.setValue(0);
    setIsStoryOpen(false);
    setSelectedStoryIndex(0); // Reset index
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsPaused(false);
    setIsViewsModalVisible(false);
    setVideoDuration(0);
  }, [progressAnim]);

  const handleStoryEnd = useCallback(() => {
    progressAnim.stopAnimation();
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (selectedStoryIndex < data.length - 1) {
      flatListRef.current?.scrollToIndex({
        index: selectedStoryIndex + 1,
        animated: true,
      });
    } else {
      handleCloseStory();
    }
  }, [selectedStoryIndex, data.length, handleCloseStory, progressAnim]);

  const startProgressBarAnimation = useCallback(() => {
    progressAnim.stopAnimation();
    progressAnim.setValue(0);

    const currentStory = data[selectedStoryIndex];
    let duration = animatedSec;

    if (currentStory?.mediaType === 'video') {
      if (videoDuration === 0) {
        return;
      }
      duration = videoDuration * 1000;
    }

    Animated.timing(progressAnim, {
      toValue: 1,
      duration: duration,
      useNativeDriver: false,
    }).start(({finished}) => {
      if (finished) {
        handleStoryEnd();
      }
    });

    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    if (currentStory?.mediaType === 'image') {
      timeoutRef.current = setTimeout(() => {
        handleStoryEnd();
      }, duration);
    }
  }, [selectedStoryIndex, videoDuration, data, handleStoryEnd, progressAnim]);

  const handleOpenStory = useCallback(
    (index: number) => {
      setSelectedStoryIndex(index);
      setIsStoryOpen(true);
      setIsPaused(false);
      setIsViewsModalVisible(false);
      setLoading(true);
      setLoadError(false);
      setVideoDuration(0);

      const storyId = data[index]?._id;
      if (storyId) {
        markStoryAsSeen(storyId);
      }
    },
    [data],
  );

  const handleScroll = useCallback(
    (event: any) => {
      const newIndex = Math.round(event.nativeEvent.contentOffset.x / width);
      if (newIndex !== selectedStoryIndex) {
        handleOpenStory(newIndex);
      }
    },
    [selectedStoryIndex, handleOpenStory],
  );

  const handleVideoProgress = useCallback(
    (progress: any) => {
      if (!isPaused && !isViewsModalVisible && progress.seekableDuration > 0) {
        progressAnim.setValue(progress.currentTime / progress.seekableDuration);
      }
    },
    [isPaused, isViewsModalVisible, progressAnim],
  );

  const handleVideoLoad = useCallback((data: any) => {
    setLoading(false);
    setVideoDuration(data.duration);
  }, []);

  // --- PanResponder for Swipe Down to Close, Taps, and Long Press ---
  const initialTouchY = useRef(0);
  const pressStartTime = useRef(0);
  const touchX = useRef(0); // Store touchX here

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onStartShouldSetPanResponderCapture: () => true,

      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 10
        );
      },
      onMoveShouldSetPanResponderCapture: (evt, gestureState) => {
        return (
          Math.abs(gestureState.dy) > Math.abs(gestureState.dx) &&
          Math.abs(gestureState.dy) > 10
        );
      },

      onPanResponderGrant: (evt, gestureState) => {
        initialTouchY.current = gestureState.y0;
        pressStartTime.current = Date.now();
        touchX.current = gestureState.x0;
        setIsPaused(true);
        progressAnim.stopAnimation();
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      },

      onPanResponderRelease: (evt, gestureState) => {
        const pressDuration = Date.now() - pressStartTime.current;
        const dx = Math.abs(gestureState.dx);
        const dy = Math.abs(gestureState.dy);
        const swipeDownDistance = gestureState.dy;

        // Swipe down to close
        if (swipeDownDistance > 100 && dy > dx) {
          handleCloseStory();
          return;
        }

        // Tap (left or right)
        if (pressDuration < 300 && dx < 10 && dy < 10) {
          if (touchX.current < width / 2) {
            // Left tap: previous story
            if (selectedStoryIndex > 0) {
              flatListRef.current?.scrollToIndex({
                index: selectedStoryIndex - 1,
                animated: true,
              });
            } else {
              handleCloseStory();
            }
          } else {
            // Right tap: next story
            if (selectedStoryIndex < data.length - 1) {
              flatListRef.current?.scrollToIndex({
                index: selectedStoryIndex + 1,
                animated: true,
              });
            } else {
              handleCloseStory();
            }
          }
        }

        // 👇 Always resume if modal not open
        if (!isViewsModalVisible) {
          setIsPaused(false);
          startProgressBarAnimation();
        }
      },

      onPanResponderTerminate: () => {
        if (!isViewsModalVisible) {
          setIsPaused(false);
          startProgressBarAnimation();
        }
      },

      onShouldBlockNativeResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dy) > Math.abs(gestureState.dx);
      },
    }),
  ).current;

  // --- Effects ---

  useEffect(() => {
    const shouldAnimate = isStoryOpen && !isPaused && !isViewsModalVisible;
    const currentStory = data[selectedStoryIndex];

    if (shouldAnimate) {
      if (currentStory?.mediaType === 'image') {
        startProgressBarAnimation();
      } else if (currentStory?.mediaType === 'video' && videoDuration > 0) {
        startProgressBarAnimation();
      } else if (currentStory?.mediaType === 'video' && videoDuration === 0) {
        progressAnim.stopAnimation();
      }
    } else {
      progressAnim.stopAnimation();
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      progressAnim.stopAnimation();
      progressAnim.setValue(0);
    };
  }, [
    isStoryOpen,
    selectedStoryIndex,
    isPaused,
    isViewsModalVisible,
    videoDuration,
    data,
    startProgressBarAnimation,
    progressAnim,
  ]);

  useEffect(() => {
    if (isStoryOpen) {
      const subscription = BackHandler.addEventListener(
        'hardwareBackPress',
        () => {
          handleCloseStory();
          return true;
        },
      );
      return () => {
        subscription.remove();
      };
    }
  }, [isStoryOpen, handleCloseStory]);

  const handleDeleteStory = async () => {
    try {
      if (selectedStory?._id) {
        await deleteStory(selectedStory._id);
        queryClient.invalidateQueries({queryKey: ['userStories']});
        showSuccessToast({description: 'Story deleted successfully'});
        setShowViewsModal(false);
        navigation.goBack();
      }
    } catch (err) {
      console.error('Failed to delete story:', err);
      showErrorToast({description: 'Error deleting story'});
    }
  };

  const handleDeleteStoryPress = () => {
    popUpConfToast.confirmModal({
      clickOnConfirm: handleDeleteStory,
      textBody: 'Are you sure you want to delete this story?',
      buttonText: 'Delete',
    });
  };

  const renderStoryContent = ({item, index}: any) => {
    const isCurrentStory = index === selectedStoryIndex;

    return (
      <View style={styles.storyContentWrapper}>
        {/* Apply panHandlers here, this View will capture all touches */}
        <View
          style={styles.panResponderContainer}
          {...panResponder.panHandlers}>
          {isCurrentStory && (
            <Animated.View
              style={[
                styles.progressBar,
                {
                  width: progressAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }),
                },
              ]}
            />
          )}

          {item.mediaType === 'image' ? (
            <>
              {loading && !loadError && (
                <ActivityIndicator
                  size="large"
                  color={color.mainColor}
                  style={styles.loader}
                />
              )}
              {loadError && (
                <Text style={styles.errorText}>Failed to load image</Text>
              )}
              <Image
                source={{uri: `${fileViewURL}${item.mediaKey}`}}
                style={styles.image}
                resizeMode="contain"
                onLoadEnd={() => setLoading(false)}
                onError={() => {
                  setLoading(false);
                  setLoadError(true);
                }}
              />
            </>
          ) : item.mediaType === 'video' ? (
            <>
              {loading && !loadError && (
                <ActivityIndicator
                  size="large"
                  color={color.mainColor}
                  style={styles.loader}
                />
              )}
              {loadError && (
                <Text style={styles.errorText}>Failed to load video</Text>
              )}
              <Video
                source={{uri: `${fileViewURL}${item.mediaKey}`}}
                style={styles.video}
                resizeMode="contain"
                onEnd={handleStoryEnd}
                onError={() => {
                  setLoading(false);
                  setLoadError(true);
                }}
                paused={isPaused || isViewsModalVisible || !isCurrentStory}
                repeat={false}
                onLoad={handleVideoLoad}
                onProgress={handleVideoProgress}
                playInBackground={false}
                playWhenInactive={false}
              />
              <View style={styles.speakerPPBtns}>
                {/* <TouchableOpacity
                  onPress={() => {
                    setIsPaused(prev => !prev); // Toggle pause state
                  }}
                  style={styles.speakerOnOffBtn}>
                  <Image
                    source={
                      true
                        ? require('../../assets/icons/speakerOn.png')
                        : require('../../assets/icons/speakerOff.png')
                    }
                    style={styles.speakerIcons}
                  />
                </TouchableOpacity> */}
                <TouchableOpacity
                  onPress={() => {
                    setIsPaused(prev => !prev); // Toggle pause state
                  }}
                  style={styles.playPauseButton}>
                  <Image
                    source={
                      isPaused
                        ? require('../../assets/icons/play.png')
                        : require('../../assets/icons/pause.png')
                    }
                    style={styles.playPauseIcon}
                  />
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.unsupportedText}>Unsupported media type</Text>
          )}
          {item.caption ? (
            <View style={styles.captionContainer}>
              <Text style={styles.captionText}>{item.caption}</Text>
            </View>
          ) : null}
          <View style={styles.bottomInfo}>
            <Text style={styles.timeText}>
              Posted at: {formatTime24Hour(item.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  const renderStoryListItem = ({item, index}: any) => {
    return (
      <View
        style={{
          margin: 4,
          borderRadius: 12,
          overflow: 'hidden',
          backgroundColor: '#fff',
          ...shadow,
        }}>
        <TouchableOpacity
          onPress={() => handleOpenStory(index)}
          style={{
            borderRadius: 12,
            width: width / 3 - 16,
            height: width / 3 - 16,
          }}>
          {item.mediaType === 'video' ? (
            <View style={{position: 'relative'}}>
              <Video
                source={{uri: `${fileViewURL}${item.mediaKey}`}}
                style={styles.thumbnailImage}
                resizeMode="cover"
                paused={true}
                muted={true}
                onError={() => console.log('Error loading video thumbnail')}
              />
              <View style={styles.playIcon}>
                <Image
                  source={require('../../assets/icons/play.png')}
                  style={{
                    height: 10,
                    width: 10,
                  }}
                  tintColor={'#fff'}
                />
                {/* <CustomText style={{fontSize: 10}}>2:40</CustomText> */}
              </View>
            </View>
          ) : (
            <Image
              source={{uri: `${fileViewURL}${item.mediaKey}`}}
              style={styles.thumbnailImage}
            />
          )}
        </TouchableOpacity>
        {isMe && (
          <View style={styles.DelEyeMainView}>
            <TouchableOpacity
              style={{padding: 4}}
              onPress={() => {
                setSelectedStory(item);
                handleDeleteStoryPress();
              }}>
              <Image
                source={require('../../assets/icons/delete.png')}
                style={{height: 20, width: 20}}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={[myStyle.row, {gap: 4}]}
              onPress={() => {
                setSelectedStory(item);
                setShowViewsModal(true);
              }}>
              <CustomText>{item.views?.length || 0}</CustomText>
              <Image
                source={require('../../assets/icons/openEye.png')}
                style={{height: 24, width: 24}}
                tintColor={'grey'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
    );
  };
  return (
    <MainContainer
      title={
        isMe
          ? 'My Story'
          : userData?.data
          ? getTextWithLength(
              `${userData.data.firstName} ${userData.data.lastName}`,
              22,
            )
          : 'View Story'
      }
      isBack>
      {data.length === 0 && (
        // <CustomErrorMessage message="No stories available" />
        <View style={styles.noStoryAvilView}>
          <CustomText style={{fontSize: 32}}>🙄</CustomText>
          <CustomText style={styles.noDataText}>
            No stories available
          </CustomText>
        </View>
      )}
      {!isStoryOpen ? (
        <FlatList
          key={'grid'}
          data={data}
          numColumns={3}
          contentContainerStyle={styles.gridContainer}
          keyExtractor={item => item._id}
          renderItem={renderStoryListItem}
        />
      ) : (
        <FlatList
          key={'fullScreen'}
          ref={flatListRef}
          data={data}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          renderItem={renderStoryContent}
          keyExtractor={item => item._id}
          onScroll={handleScroll}
          initialScrollIndex={selectedStoryIndex}
          getItemLayout={(_, index) => ({
            length: width,
            offset: width * index,
            index,
          })}
          onScrollBeginDrag={() => {
            // This is crucial: Pause when FlatList starts its own drag
            setIsPaused(true);
            progressAnim.stopAnimation();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
          }}
          onScrollEndDrag={() => {
            // handleScroll will be called, which calls handleOpenStory, and
            // handleOpenStory will manage the state and trigger animation restart via useEffect
            // No need to explicitly setIsPaused(false) here, useEffect handles it
          }}
        />
      )}
      <CustomBottomModal
        visible={showViewsModal}
        onClose={() => setShowViewsModal(false)}
        modalHeight={400}>
        <CustomText style={{fontSize: 18, fontWeight: 'bold', marginBottom: 8}}>
          Viewers
        </CustomText>
        {selectedStory?.views?.length ? (
          selectedStory.views.map(viewer => (
            <View key={viewer._id} style={{marginBottom: 12}}>
              <CustomText>
                {viewer.firstName} {viewer.middleName} {viewer.lastName}
              </CustomText>
              <CustomText>{viewer.phone}</CustomText>
            </View>
          ))
        ) : (
          <CustomText>No viewers yet.</CustomText>
        )}
      </CustomBottomModal>
    </MainContainer>
  );
};

export default ViewStory;

const styles = StyleSheet.create({
  gridContainer: {
    padding: 8,
    gap: 8,
  },
  progressBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: 4,
    backgroundColor: color.mainColor,
    zIndex: 10,
    width: '100%', // Ensure it spans full width for animation
  },
  thumbnailItem: {
    width: width / 3 - 16,
    height: width / 3 - 16,
    margin: 4,
    borderRadius: 10,
    overflow: 'hidden',
  },
  noDataText: {
    fontSize: 16,
    color: 'grey',
    textAlign: 'center',
    marginTop: 8,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  storyContainer: {
    width: width,
    height: height * 0.75,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  panResponderContainer: {
    width: width,
    height: height, // 🔥 Change this to full screen height
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000', // This is correct, already black background
  },

  noStoryAvilView: {
    height: sizes.height,
    width: sizes.width,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playIcon: {
    position: 'absolute',
    top: 6,
    right: 8,
    alignItems: 'center',
    gap: 2,
    borderRadius: 8,
    backgroundColor: '#00000080',
    padding: 4,
    flexDirection: 'row',
  },
  loader: {
    position: 'absolute',
    top: '50%',
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    position: 'absolute',
    alignSelf: 'center',
  },
  unsupportedText: {
    color: '#fff',
    fontSize: 18,
    alignSelf: 'center',
  },
  bottomInfo: {
    position: 'absolute',
    top: 80,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // width: width * 0.9,
    alignSelf: 'flex-end',
  },
  timeText: {
    color: '#fff',
    fontSize: 14,
  },
  image: {
    width: width, // 🔥 Change this to cover full width
    height: height, // 🔥 Change this to cover full height
  },

  video: {
    width: width, // 🔥 Change this to cover full width
    height: height, // 🔥 Change this to cover full height
  },

  playPauseButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    // borderRadius: 15,
    padding: 5,
  },
  DelEyeMainView: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    gap: 12,
    marginRight: 8,
    padding: 4,
  },
  speakerPPBtns: {
    position: 'absolute',
    top: 20,
    right: 20,
    zIndex: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  speakerOnOffBtn: {
    padding: 8,
  },
  speakerIcons: {
    height: 26,
    width: 26,
    tintColor: '#fff',
  },
  playPauseIcon: {
    width: 22,
    height: 22,
    tintColor: '#fff',
  },
  viewsButton: {
    marginTop: 80,
    backgroundColor: color.mainColor,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 12,
  },
  viewsButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  noViewsText: {
    fontSize: 16,
    color: 'gray',
    textAlign: 'center',
    marginTop: 20,
  },
  viewerItem: {
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewerName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  viewerPhone: {
    fontSize: 14,
    color: 'gray',
  },
  storyContentWrapper: {
    width: width,
    height: height * 0.85,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captionContainer: {
    position: 'absolute', // 🔥 Add this
    bottom: 100, // 🔥 Move it above the bottom info
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'rgba(0,0,0,0.4)',
    // borderRadius: 8,
    alignSelf: 'center',
    // maxWidth: '90%',
    width: sizes.width,
  },

  captionText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
  },
});
