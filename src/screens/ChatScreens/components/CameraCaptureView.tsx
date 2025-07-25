import React from 'react';
import {View, TouchableOpacity, Image} from 'react-native';
import {Camera, CameraType} from 'react-native-camera-kit';
import {chatScreenStyles} from '../../../sharedStyles';
import CustomText from '../../../components/CustomText';

interface CameraCaptureViewProps {
  cameraRef: any;
  cameraType: CameraType;
  switchCamera: () => void;
  onBack: () => void;
  onCaptured: (uri: string) => void;
}

const CameraCaptureView: React.FC<CameraCaptureViewProps> = ({
  cameraRef,
  cameraType,
  switchCamera,
  onBack,
  onCaptured,
}) => {
  return (
    <View style={chatScreenStyles.viewCamMainView}>
      <Camera
        ref={cameraRef}
        cameraType={cameraType}
        flashMode="auto"
        style={{flex: 1}}
        onCapture={async event => {
          const {uri} = event;
          onCaptured(uri);
          onBack();
        }}
      />

      <TouchableOpacity style={chatScreenStyles.camBackBtn} onPress={onBack}>
        <CustomText style={{color: '#000', fontSize: 16, fontWeight: '400'}}>
          Back
        </CustomText>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={async () => {
          const {uri} = await cameraRef.current.capture();
          onCaptured(uri);
        }}
        style={chatScreenStyles.captureCamBtn}>
        <Image
          source={require('../../../assets/icons/capture-camera.png')}
          style={{height: 32, width: 32}}
          tintColor={'#fff'}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={chatScreenStyles.switchCamBtn}
        onPress={switchCamera}>
        <Image
          source={require('../../../assets/icons/switch-camera.png')}
          style={{height: 32, width: 32}}
          tintColor={'#fff'}
        />
      </TouchableOpacity>
    </View>
  );
};

export default CameraCaptureView;
