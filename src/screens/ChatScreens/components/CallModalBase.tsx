import React, {useState} from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  Text,
  Image,
  StyleSheet,
} from 'react-native';
import CustomAvatar from '../../../components/CustomAvatar';

interface CallModalBaseProps {
  visible: boolean;
  onClose: () => void;
  userName: string;
  avatarUrl?: string;
  showVideoToggle?: boolean;
}

const CallModalBase: React.FC<CallModalBaseProps> = ({
  visible,
  onClose,
  userName,
  avatarUrl,
  showVideoToggle = true,
}) => {
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [speakerMode, setSpeakerMode] = useState<
    'speaker' | 'ear' | 'bluetooth'
  >('speaker');

  const toggleSpeaker = () => {
    setSpeakerMode(prev =>
      prev === 'speaker' ? 'ear' : prev === 'ear' ? 'bluetooth' : 'speaker',
    );
  };

  const getSpeakerIcon = () => {
    switch (speakerMode) {
      case 'speaker':
        return require('../../../assets/icons/speakerOn.png');
      case 'ear':
        return require('../../../assets/icons/speakerOff.png');
      case 'bluetooth':
        return require('../../../assets/icons/bluetooth.png');
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.container}>
        {/* Top */}
        <View style={styles.topBar}>
          <TouchableOpacity onPress={onClose}>
            <Image
              source={require('../../../assets/icons/back.png')}
              style={styles.icon}
              tintColor={'#fff'}
            />
          </TouchableOpacity>
          <Text style={styles.userName}>{userName}</Text>
          <View style={{width: 24}} />
        </View>

        {/* Center Avatar */}
        <View style={styles.centerContent}>
          <CustomAvatar
            style={{height: 160, width: 160, borderRadius: 80}}
            imgUrl={avatarUrl}
            name={userName}
          />
        </View>

        {/* Bottom Controls */}
        <View style={styles.controlsContainer}>
          {/* Video Toggle */}
          {showVideoToggle && (
            <TouchableOpacity
              style={styles.controlBtn}
              onPress={() => setIsVideoOn(prev => !prev)}>
              <Image
                source={
                  isVideoOn
                    ? require('../../../assets/icons/video.png')
                    : require('../../../assets/icons/noVideo.png')
                }
                style={styles.controlIcon}
              />
            </TouchableOpacity>
          )}

          {/* Speaker Toggle */}
          <TouchableOpacity style={styles.controlBtn} onPress={toggleSpeaker}>
            <Image source={getSpeakerIcon()} style={styles.controlIcon} />
          </TouchableOpacity>

          {/* Mic Toggle */}
          <TouchableOpacity
            style={styles.controlBtn}
            onPress={() => setIsMicOn(prev => !prev)}>
            <Image
              source={
                isMicOn
                  ? require('../../../assets/icons/mic.png')
                  : require('../../../assets/icons/micOff.png')
              }
              style={styles.controlIcon}
            />
          </TouchableOpacity>

          {/* End Call */}
          <TouchableOpacity style={styles.endCallBtn} onPress={onClose}>
            <Image
              source={require('../../../assets/icons/phoneDown.png')}
              style={[styles.controlIcon, {tintColor: '#fff'}]}
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default CallModalBase;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingBottom: 40,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  icon: {
    height: 24,
    width: 24,
  },
  userName: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  controlBtn: {
    backgroundColor: '#333',
    padding: 14,
    borderRadius: 50,
  },
  controlIcon: {
    width: 28,
    height: 28,
  },
  endCallBtn: {
    backgroundColor: 'red',
    padding: 16,
    borderRadius: 50,
  },
});
