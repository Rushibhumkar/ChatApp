import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Image,
  ImageStyle,
} from 'react-native';
import OnlyLoader from './LoadingCompo/OnlyLoader';

interface CustomAvatarProps {
  name: string;
  imgUrl?: string;
  mb?: number;
  style?: StyleProp<ViewStyle>;
  imgStyle?: StyleProp<ImageStyle>;
  disabled?: boolean;
  onPress?: any;
  imgLoader?: any;
}

// Fixed color mapping for alphabets with matching text color
const colorMapping: {[key: string]: {bg: string; text: string}} = {
  A: {bg: '#F44336', text: '#B71C1C'},
  B: {bg: '#E91E63', text: '#880E4F'},
  C: {bg: '#9C27B0', text: '#4A148C'},
  D: {bg: '#673AB7', text: '#311B92'},
  E: {bg: '#3F51B5', text: '#1A237E'},
  F: {bg: '#2196F3', text: '#0D47A1'},
  G: {bg: '#03A9F4', text: '#01579B'},
  H: {bg: '#00BCD4', text: '#006064'},
  I: {bg: '#009688', text: '#004D40'},
  J: {bg: '#F44336', text: '#B71C1C'},
  K: {bg: '#8BC34A', text: '#33691E'},
  L: {bg: '#CDDC39', text: '#827717'},
  M: {bg: '#FFC107', text: '#FF6F00'},
  N: {bg: '#FF9800', text: '#E65100'},
  O: {bg: '#FF5722', text: '#BF360C'},
  P: {bg: '#795548', text: '#3E2723'},
  Q: {bg: '#9E9E9E', text: '#424242'},
  R: {bg: '#607D8B', text: '#263238'},
  S: {bg: '#F06292', text: '#880E4F'},
  T: {bg: '#BA68C8', text: '#4A148C'},
  U: {bg: '#4DB6AC', text: '#004D40'},
  V: {bg: '#81C784', text: '#1B5E20'},
  W: {bg: '#FFD54F', text: '#F57F17'},
  X: {bg: '#FFB74D', text: '#E65100'},
  Y: {bg: '#A1887F', text: '#3E2723'},
  Z: {bg: '#90A4AE', text: '#263238'},
};

// Fixed color for numbers and symbols
const numberSymbolColor = {bg: '#546E7A', text: '#CFD8DC'};

const CustomAvatar: React.FC<CustomAvatarProps> = ({
  name,
  imgUrl,
  mb = 0,
  style,
  disabled = false,
  onPress,
  imgLoader,
  imgStyle,
}) => {
  const getInitial = (name: string): string => {
    return name?.charAt(0).toUpperCase() || '';
  };

  const initial = getInitial(name);
  const isAlphabet = /^[A-Z]$/.test(initial);

  const {bg, text} = isAlphabet ? colorMapping[initial] : numberSymbolColor;

  return (
    <TouchableOpacity
      activeOpacity={0.6}
      onPress={onPress}
      style={{marginBottom: mb}}
      disabled={disabled}>
      {imgLoader ? (
        <View style={styles.loadCenter}>
          <OnlyLoader />
        </View>
      ) : imgUrl ? (
        <Image
          source={{uri: imgUrl}}
          style={[styles.image, {height: 100, width: 100}, imgStyle]}
        />
      ) : (
        <View style={[styles.avatar, {backgroundColor: bg}, style]}>
          <Text style={[styles.name, {color: text}]}>{initial}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  name: {
    fontWeight: '600',
    fontSize: 16,
  },
  image: {
    width: 28,
    height: 28,
    borderRadius: 50,
  },
  loadCenter: {
    height: 100,
    width: 100,
    justifyContent: 'center',
    borderRadius: 50,
    alignItems: 'center',
  },
});

export default CustomAvatar;
