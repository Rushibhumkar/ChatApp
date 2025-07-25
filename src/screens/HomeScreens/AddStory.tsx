import {
  Alert,
  Image,
  Keyboard,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import MainContainer from '../../components/MainContainer';
import {launchImageLibrary} from 'react-native-image-picker';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import CustomModal from '../../components/CustomModal';
import CustomText from '../../components/CustomText';
import {sizes} from '../../const';
import {color} from '../../const/color';
import CustomButton from '../../components/Buttons/CustomButton';
import {API_AXIOS} from '../../api/axiosInstance';
import {myConsole} from '../../utils/myConsole';
import {homeRoute} from '../AuthScreens/routeName';
import {useQueryClient} from '@tanstack/react-query';
import Video from 'react-native-video';

const AddStory = ({navigation}: any) => {
  const [imageViewModalVisible, setImageViewModalVisible] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<any>(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [caption, setCaption] = useState('');

  const queryClient = useQueryClient();

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      event => setKeyboardHeight(event.endCoordinates.height),
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => setKeyboardHeight(0),
    );
    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  const pickFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'mixed',
        includeBase64: false,
      });

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        console.log('📁 Selected file:', selectedFile);

        if (selectedFile.type?.includes('video')) {
          console.log('🎥 Video file selected');
          // Duration check removed
        }

        setImageViewModalVisible(true);

        const formData = new FormData();
        formData.append('files', {
          uri: selectedFile.uri,
          type: selectedFile.type,
          name: selectedFile.fileName || 'upload.jpg',
        });

        setUploading(true);
        const {data} = await API_AXIOS.post('/file/upload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        setUploading(false);

        if (data?.success && data?.data?.files?.length > 0) {
          const uploadedFilePath = data.data.files[0];

          setFile({
            uri: selectedFile.uri,
            fileName: selectedFile.fileName || 'upload.jpg',
            mediaKey: uploadedFilePath,
            mediaType: selectedFile.type?.includes('video') ? 'video' : 'image',
          });
        }
      }
    } catch (error) {
      console.error('❌ Error picking or uploading file:', error);
      showErrorToast({description: 'Failed to pick or upload the file.'});
    }
  };

  const uploadStory = async () => {
    if (!file?.mediaKey) {
      showErrorToast({description: 'Please select a file first'});
      return;
    }

    try {
      const response = await API_AXIOS.post('/story', {
        mediaKey: file.mediaKey,
        mediaType: file.mediaType,
        caption: caption || undefined,
      });

      queryClient.invalidateQueries({queryKey: ['userStories']});
      setFile(null);
      setCaption('');
      setImageViewModalVisible(false);
      showSuccessToast({description: 'Story uploaded successfully'});
      navigation.goBack();
    } catch (error) {
      console.error('Error uploading story:', error);
      showErrorToast({description: 'Failed to upload story'});
    }
  };

  return (
    <MainContainer title="Add Story" isBack>
      <View style={styles.container}>
        {/* <CustomButton title="Pick File" onPress={pickFile} /> */}
        <TouchableOpacity
          style={{
            backgroundColor: color.smoothBg,
            borderRadius: 12,
            padding: 12,
          }}
          onPress={pickFile}>
          <Image
            source={require('../../assets/icons/uploadImg.png')}
            style={{height: 40, width: 40}}
            tintColor={color.mainColor}
          />
        </TouchableOpacity>

        <CustomModal
          visible={imageViewModalVisible}
          onClose={() => setImageViewModalVisible(false)}
          hasBackdrop={false}
          showCloseIcon
          containerStyle={{
            height: keyboardHeight ? '60%' : '64%',
            marginTop: 40,
            paddingBottom: 20,
            // backgroundColor: 'red',
            width: sizes.width / 1.1,
          }}>
          <View
            style={{
              flex: 1,
              alignItems: 'center',
              paddingBottom: 12,
            }}>
            <CustomText style={styles.fileName}>
              {file?.fileName || 'Selected File'}
            </CustomText>

            {uploading ? (
              <LoadingCompo
                style={{marginTop: 30}}
                minHeight={sizes.width / 2}
              />
            ) : file?.uri ? (
              file.mediaType === 'video' ? (
                <Video
                  source={{uri: file.uri}}
                  style={[
                    styles.viewImg,
                    {
                      width: sizes.width / 1.2,
                      height: keyboardHeight ? 180 : 400,
                    },
                  ]}
                  controls={true} // You can use controls to allow playback controls like pause, play, etc.
                  resizeMode="contain"
                />
              ) : (
                <Image
                  source={{uri: file.uri}}
                  style={[
                    styles.viewImg,
                    {
                      width: sizes.width / 1.2,
                      height: keyboardHeight ? 180 : 400,
                    },
                  ]}
                  resizeMode="contain"
                />
              )
            ) : null}

            <View
              style={{
                marginTop: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-around',
                gap: 12,
                // backgroundColor: 'red',
                width: '90%',
              }}>
              <View style={styles.mainInputCont}>
                <TextInput
                  style={styles.input}
                  placeholder="Enter caption (optional)..."
                  placeholderTextColor="#999"
                  value={caption}
                  onChangeText={setCaption}
                />
              </View>
              <TouchableOpacity
                style={[
                  styles.sendBtn,
                  {
                    backgroundColor: uploading
                      ? `${color.mainColor}40`
                      : color.mainColor,
                  },
                ]}
                onPress={uploadStory}
                disabled={uploading}>
                <Image
                  tintColor={'#fff'}
                  source={require('../../assets/icons/sent.png')}
                  style={styles.icon}
                />
              </TouchableOpacity>
            </View>
          </View>
        </CustomModal>
      </View>
    </MainContainer>
  );
};

export default AddStory;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fileName: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: '#000',
    paddingHorizontal: 10,
    height: 40,
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 6,
  },
  sendBtn: {
    padding: 12,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  viewImg: {
    marginTop: 10,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  mainInputCont: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F2',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#CCC',
    width: '80%',
  },
});
