import {
  StyleSheet,
  View,
  Image,
  Linking,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {myConsole} from '../../../utils/myConsole';
import {formatTime24Hour} from '../../../utils/commonFunction';
import CustomText from '../../../components/CustomText';
import {color} from '../../../const/color';
import CustomAvatar from '../../../components/CustomAvatar';
import MessageStatusTicks from './MessageStatusTicks';
import {useNavigation} from '@react-navigation/native';
import ImageViewer from 'react-native-image-zoom-viewer';
import {fileViewURL} from '../../../api/axiosInstance';
import Video from 'react-native-video';
import {sizes} from '../../../const';

const MessageComponent = ({
  senderId,
  data,
  selectedMessages,
  onToggleSelect,
}: any) => {
  const [viewFullImg, setViewFullImg] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isPaused, setIsPaused] = useState(false); // To handle play/pause functionality
  const [loadError, setLoadError] = useState(false);

  const handleImageClick = (uri: string) => {
    setSelectedImage(uri); // Set the selected image URI or video URI
    setViewFullImg(true); // Show the full-screen image view
    setIsPaused(false); // Ensure the video starts playing when full-screen is opened
  };

  const navigation = useNavigation();
  const hasText = data.text && data.text.trim().length > 0;
  const hasAttachments = data.attachments && data.attachments.length > 0;
  const hasContact =
    data.contact &&
    typeof data.contact === 'object' &&
    data.contact.name &&
    data.contact.phoneNumber;
  const hasLocation =
    data.location &&
    typeof data.location === 'object' &&
    data.location.latitude !== undefined &&
    data.location.longitude !== undefined;

  const isSender = data.sender === senderId;

  const isSelected = selectedMessages?.some?.(m => m._id === data._id);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => {
        if (isSelected) {
          onToggleSelect(data);
          // unselect on single tap if already selected
        }
      }}
      onLongPress={() => onToggleSelect(data)} // toggle on long press
      style={[
        data.sender === senderId && data.attachments?.length > 0
          ? styles.myMsgAttachment
          : data.sender === senderId
          ? styles.myMessageContainer
          : styles.otherMessageContainer,
        {
          alignSelf: data.sender === senderId ? 'flex-end' : 'flex-start',
          backgroundColor: isSelected
            ? '#B2DFDB'
            : data.sender === senderId
            ? color.mainColorFade
            : '#E0E0E0',
        },
      ]}
      key={data?._id}>
      {/* If text exists, show text and timestamp in the same row */}
      {hasAttachments &&
        data.attachments.map((attachment: any, index: number) => (
          <View key={index} style={{position: 'relative', marginBottom: 6}}>
            <TouchableOpacity
              onPress={() => {
                if (isSelected) {
                  onToggleSelect(data);
                } else {
                  handleImageClick(`${fileViewURL}${attachment.path}`);
                }
              }}
              onLongPress={() => onToggleSelect(data)}>
              {attachment.mimeType.includes('video') ? (
                <View style={{position: 'relative'}}>
                  <Video
                    source={{uri: `${fileViewURL}${attachment.path}`}}
                    style={{height: 220, width: 220}}
                    resizeMode="cover"
                    paused={true}
                    poster={`${fileViewURL}${attachment.path}`}
                    onError={(error: any) =>
                      myConsole('Error loading video:', error)
                    }
                  />

                  {/* Centered Play Icon */}
                  <View
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: [{translateX: -20}, {translateY: -20}],
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                      padding: 10,
                      borderRadius: 30,
                    }}>
                    <Image
                      source={require('../../../assets/icons/play.png')} // your downloaded PNG
                      style={{width: 30, height: 30, tintColor: '#fff'}}
                    />
                  </View>
                </View>
              ) : (
                <Image
                  source={{uri: `${fileViewURL}${attachment.path}`}}
                  style={{height: 220, width: 220}}
                  resizeMode="cover"
                  onError={error => myConsole('Error loading image:', error)}
                />
              )}
            </TouchableOpacity>

            {/* Time and Ticks on media */}
            <View style={styles.attachmentTickTime}>
              <CustomText style={{color: '#fff', fontSize: 10}}>
                {formatTime24Hour(data.createdAt)}
              </CustomText>
              <MessageStatusTicks
                isSeen={data.isSeen}
                isDelivered={data.isDelivered}
                isSender={data.sender === senderId}
              />
            </View>
          </View>
        ))}

      {viewFullImg && (
        <Modal
          visible={viewFullImg}
          transparent={true}
          onRequestClose={() => setViewFullImg(false)}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}>
            {selectedImage.endsWith('.mp4') ? (
              <Video
                source={{uri: selectedImage}} // Use the URI selected from the chat message
                style={{width: sizes.width, height: sizes.height}}
                resizeMode="contain"
                paused={isPaused} // Play or pause based on the state
                onError={() => setLoadError(true)} // Handle the error and set loadError state
                onEnd={() => setViewFullImg(false)} // Close when video ends
              />
            ) : (
              <Image
                source={{uri: selectedImage}} // Use the selected image URI
                style={{width: sizes.width, height: sizes.height}}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity
              style={{
                position: 'absolute',
                top: 20,
                left: 20,
                backgroundColor: '#000',
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 50,
                padding: 12,
              }}
              activeOpacity={0.6}
              onPress={() => setViewFullImg(false)}>
              <Image
                source={require('../../../assets/icons/back.png')}
                style={{height: 32, width: 32}}
                tintColor={'#fff'}
              />
            </TouchableOpacity>
            {/* Show error message if the video fails to load */}
            {loadError && (
              <CustomText
                style={{
                  color: 'red',
                  position: 'absolute',
                  bottom: 20,
                  zIndex: 20,
                }}>
                Failed to load video
              </CustomText>
            )}

            {selectedImage.endsWith('.mp4') && (
              <TouchableOpacity
                onPress={() => setIsPaused(!isPaused)}
                style={{
                  position: 'absolute',
                  top: '50%',
                  zIndex: 20,
                  backgroundColor: 'rgba(0, 0, 0, 0.5)',
                  padding: 10,
                  borderRadius: 50,
                }}>
                <Image
                  source={
                    isPaused
                      ? require('../../../assets/icons/play.png')
                      : require('../../../assets/icons/pause.png')
                  }
                  style={{width: 30, height: 30}}
                />
              </TouchableOpacity>
            )}
          </View>
        </Modal>
      )}

      {hasContact && (
        <View>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}>
            <CustomAvatar
              imgUrl={data.contact.profilePicture}
              name={data.contact.name}
              imgStyle={{height: 32, width: 32}}
            />
            <CustomText
              style={
                data.sender === senderId
                  ? styles.myMessageText
                  : styles.otherMessageText
              }>
              {data.contact.name}
            </CustomText>
          </View>
          <CustomText
            style={
              data.sender === senderId
                ? styles.myMsgNumber
                : styles.otherMsgNumber
            }>
            {data.contact.phoneNumber}
          </CustomText>
          {data.contact.email && (
            <CustomText
              style={
                data.sender === senderId
                  ? styles.myMsgNumber
                  : styles.otherMsgNumber
              }>
              {data.contact.email}
            </CustomText>
          )}
          <View style={styles.timeTickView}>
            <CustomText
              style={styles.callBtn}
              onPress={() => {
                const phoneNumber = data.contact.phoneNumber;
                Linking.openURL(`tel:${phoneNumber}`);
              }}>
              Call
            </CustomText>
            <CustomText
              style={
                data.sender === senderId
                  ? styles.myMsgTime
                  : styles.otherMsgTime
              }>
              {formatTime24Hour(data.createdAt)}
            </CustomText>
            <MessageStatusTicks
              isSeen={data.isSeen}
              isDelivered={data.isDelivered}
              isSender={data.sender === senderId}
            />
          </View>
        </View>
      )}

      {hasLocation && (
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
            <Image
              source={require('../../../assets/icons/location.png')}
              style={{height: 20, width: 20}}
              tintColor={isSender ? '#fff' : '#000'}
            />
            <CustomText
              style={isSender ? styles.myMessageText : styles.otherMessageText}>
              Location
            </CustomText>
          </View>
          {data.location.name && data.location.address && (
            <CustomText
              style={[
                isSender ? styles.myLocTxt : styles.otherLocTxt,
                {marginLeft: 4},
              ]}>
              {data.location.name || ''}
              {', '}
              {data.location.address || ''}
            </CustomText>
          )}
          <View style={styles.locationNameView}>
            <CustomText
              style={styles.seeLocBtn}
              onPress={() => {
                const {latitude, longitude} = data.location;
                const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
                Linking.openURL(url);
              }}>
              See on Map
            </CustomText>
            <View style={styles.seeMapBelowViewStyle}>
              <CustomText
                style={
                  data.sender === senderId
                    ? styles.myMsgTime
                    : styles.otherMsgTime
                }>
                {formatTime24Hour(data.createdAt)}
              </CustomText>
              <MessageStatusTicks
                isSeen={data.isSeen}
                isDelivered={data.isDelivered}
                isSender={data.sender === senderId}
              />
            </View>
          </View>
        </View>
      )}

      {hasText && !hasAttachments && !hasContact && !hasLocation && (
        <View style={styles.textWithTimestamp}>
          <CustomText
            style={
              data.sender === senderId
                ? styles.myMessageText
                : styles.otherMessageText
            }>
            {data.text}
          </CustomText>
          <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: 4}}>
            <CustomText
              style={
                data.sender === senderId
                  ? styles.myMsgTime
                  : styles.otherMsgTime
              }>
              {formatTime24Hour(data.createdAt)}
            </CustomText>
            <MessageStatusTicks
              isSeen={data.isSeen}
              isDelivered={data.isDelivered}
              isSender={data.sender === senderId}
            />
          </View>
        </View>
      )}

      {/* Show timestamp below if attachments exist */}
      {/* {hasAttachments && (
        <View style={styles.ifAttachmentsMsgView}>
          <CustomText
            style={
              data.sender === senderId ? styles.myMsgTime : styles.otherMsgTime
            }>
            {formatTime24Hour(data.createdAt)}
          </CustomText>
          <MessageStatusTicks
            isSeen={data.isSeen}
            isDelivered={data.isDelivered}
            isSender={data.sender === senderId}
          />
        </View>
      )} */}
    </TouchableOpacity>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({
  myMessageContainer: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: color.mainColorFade,
    borderRadius: 10,
    padding: 10,
    marginVertical: 5,
    maxWidth: '70%',
    gap: 8,
    flexWrap: 'wrap',
  },
  locationNameView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
    justifyContent: 'space-between',
  },
  myMsgAttachment: {
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignSelf: 'flex-end',
    backgroundColor: color.mainColorFade,
    borderRadius: 10,
    padding: 4,
    marginVertical: 5,
    maxWidth: '70%',
    gap: 8,
    flexWrap: 'wrap',
  },
  // ifAttachmentsMsgView: {
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   gap: 4,
  //   alignSelf: 'flex-end',
  //   backgroundColor: 'red',
  // },
  ifAttachmentsMsgView: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-end',
    backgroundColor: 'red',
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },

  otherMessageContainer: {
    flexDirection: 'column', // Stack messages and attachments properly
    alignItems: 'flex-start',
    alignSelf: 'flex-start',
    backgroundColor: '#E0E0E0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 5,
    maxWidth: '70%',
    gap: 8,
    flexWrap: 'wrap',
  },
  timeTickView: {
    alignSelf: 'flex-end',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  textWithTimestamp: {
    flexDirection: 'row', // Align text and time in the same row
    gap: 4,
    justifyContent: 'space-between',
  },
  myMessageText: {
    fontSize: 16,
    color: '#fff', // White text for sender messages
    flexShrink: 1, // Prevents overflow
  },
  otherMessageText: {
    fontSize: 16,
    color: '#000', // Black text for receiver messages
    flexShrink: 1, // Prevents overflow
  },
  myLocTxt: {
    marginTop: 4,
    fontSize: 14,
    color: '#ffffff80', // White text for sender messages
    flexShrink: 1, // Prevents overflow
  },
  otherLocTxt: {
    fontSize: 14,
    color: 'grey', // Black text for receiver messages
    flexShrink: 1, // Prevents overflow
  },
  otherMsgTime: {
    fontSize: 12,
    color: 'grey',
    marginLeft: 5, // Space between text and timestamp
    alignSelf: 'flex-end',
  },
  myMsgTime: {
    fontSize: 12,
    color: '#fff',
    alignSelf: 'flex-end',
    marginLeft: 5, // Space between text and timestamp
  },
  otherMsgNumber: {
    fontSize: 14,
    color: 'grey',
    alignSelf: 'flex-end',
  },

  myMsgNumber: {
    fontSize: 14,
    color: '#fff',
    alignSelf: 'flex-end',
  },
  callBtn: {
    textDecorationLine: 'underline',
    color: color.bluTextColor,
    fontWeight: '800',
    position: 'relative',
    left: -10,
    paddingHorizontal: 8,
  },
  seeLocBtn: {
    textDecorationLine: 'underline',
    color: color.bluTextColor,
    fontWeight: '800',
  },
  seeMapBelowViewStyle: {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  attachmentTickTime: {
    position: 'absolute',
    bottom: 4,
    right: 6,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 6,
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
});
