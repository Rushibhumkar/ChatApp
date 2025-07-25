import React, {useRef, useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
  Modal,
} from 'react-native';
import {launchImageLibrary, Asset} from 'react-native-image-picker';
import {CameraType} from 'react-native-camera-kit';
import CameraCaptureView from '../../ChatScreens/components/CameraCaptureView';
import CustomText from '../../../components/CustomText';

const windowWidth = Dimensions.get('window').width;

type MediaItem = {
  uri: string;
  type: string;
};
type MediaPickerProps = {
  media: MediaItem[];
  onMediaSelected?: (media: MediaItem[]) => void;
  sizeMode?: 'portrait' | 'square' | 'mixed';
};
const MediaPicker: React.FC<MediaPickerProps> = ({
  media,
  onMediaSelected,
  sizeMode,
}) => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraType, setCameraType] = useState<CameraType>('back');
  const cameraRef = useRef<any>(null);

  const pickMedia = () => {
    launchImageLibrary(
      {
        mediaType: 'mixed',
        selectionLimit: 0,
      },
      response => {
        if (response.assets) {
          const newAssets = response.assets.map((item: Asset) => ({
            uri: item.uri!,
            type: item.type || 'image/jpeg',
          }));
          const newMedia = [...media, ...newAssets];
          onMediaSelected?.(newMedia);
        }
      },
    );
  };

  const handleCapture = (uri: string) => {
    const newItem = {uri, type: 'image/jpeg'};
    const newMedia = [...media, newItem];
    onMediaSelected?.(newMedia);
  };

  const switchCamera = () => {
    setCameraType(prev => (prev === 'back' ? 'front' : 'back'));
  };

  return (
    <View style={styles.container}>
      {media.length === 0 ? (
        <View style={styles.emptyState}>
          <Image
            source={require('../../../assets/icons/mediaPlaceholder.png')}
            style={{width: 80, height: 80, marginBottom: 10}}
          />
          <View>
            <CustomText style={{fontSize: 16, color: '#888'}}>
              No media selected yet!
            </CustomText>
            <CustomText
              style={{fontSize: 24, textAlign: 'center', marginTop: 6}}>
              📸🖼️
            </CustomText>
          </View>
        </View>
      ) : (
        <FlatList
          data={media}
          horizontal
          keyExtractor={item => item.uri}
          renderItem={({item}) => {
            const frameStyle =
              sizeMode === 'square'
                ? styles.squareFrame
                : sizeMode === 'portrait'
                ? styles.portraitFrame
                : styles.actualSizeFrame;

            const imageStyle =
              sizeMode === 'square'
                ? styles.squareImage
                : sizeMode === 'portrait'
                ? styles.portraitImage
                : styles.actualSizeImage;

            return (
              <View style={frameStyle}>
                <Image
                  source={{uri: item.uri}}
                  style={imageStyle}
                  resizeMode={
                    sizeMode === 'square'
                      ? 'cover'
                      : sizeMode === 'portrait'
                      ? 'contain'
                      : 'contain'
                  }
                />
              </View>
            );
          }}
          contentContainerStyle={{
            padding: 10,
            marginTop:
              sizeMode === 'mixed' ? 0 : sizeMode === 'portrait' ? 40 : 120,
          }}
        />
      )}

      {/* Gallery Button */}
      <TouchableOpacity onPress={pickMedia} style={styles.galleryBtn}>
        <Image
          source={require('../../../assets/icons/gallery.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Camera Button */}
      <TouchableOpacity
        onPress={() => setIsCameraOpen(true)}
        style={styles.cameraBtn}>
        <Image
          source={require('../../../assets/icons/camera.png')}
          style={styles.icon}
        />
      </TouchableOpacity>

      {/* Camera Modal */}
      <Modal visible={isCameraOpen} animationType="slide">
        <CameraCaptureView
          cameraRef={cameraRef}
          cameraType={cameraType}
          switchCamera={switchCamera}
          onBack={() => setIsCameraOpen(false)}
          onCaptured={handleCapture}
        />
      </Modal>
    </View>
  );
};

export default MediaPicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#fff',
  },
  galleryBtn: {
    position: 'absolute',
    bottom: 20,
    right: 90,
    backgroundColor: '#ffffffee',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#ffffffee',
    borderRadius: 50,
    padding: 10,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
  cropFrame: {
    width: 300,
    height: 300,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#eee',
    marginRight: 12,
  },
  imageInsideCrop: {
    width: 300,
    height: 400,
    alignSelf: 'center',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  squareFrame: {
    width: 300,
    height: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginRight: 12,
  },
  squareImage: {
    width: 300,
    height: 300,
    alignSelf: 'center',
  },

  mixedFrame: {
    width: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginRight: 12,
    aspectRatio: undefined, // allow natural aspect
  },

  mixedImage: {
    width: 300,
    height: undefined,
    resizeMode: 'cover',
    aspectRatio: 2 / 3,
    alignSelf: 'stretch',
  },

  actualSizeImage: {
    width: undefined,
    height: undefined,
    flex: 1,
    // alignSelf: 'stretch',
  },
  actualSizeFrame: {
    width: 300,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginRight: 12,
  },
  portraitFrame: {
    width: 300,
    height: 500,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#eee',
    marginRight: 12,
  },
  portraitImage: {
    width: 300,
    height: 500,
    alignSelf: 'center',
  },
});
