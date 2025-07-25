import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ImageSourcePropType,
  ImageStyle,
  ViewStyle,
  TextStyle,
} from 'react-native';

import {color} from '../../../const/color';

type HeaderBarProps = {
  title: string;
  onLeftPress?: () => void;
  onRightPress?: () => void;
  leftIcon?: ImageSourcePropType; // allows both require('./image.png') and uri
  rightText?: string;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
  iconStyle?: ImageStyle;
  leftIconColor?: string;
};

const HeaderBar: React.FC<HeaderBarProps> = ({
  title,
  onLeftPress,
  onRightPress,
  leftIcon,
  rightText,
  containerStyle,
  titleStyle,
  iconStyle,
  leftIconColor,
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      <TouchableOpacity onPress={onLeftPress}>
        {leftIcon && (
          <Image
            source={leftIcon}
            style={[styles.icon, iconStyle]}
            tintColor={leftIconColor || '#000'}
          />
        )}
      </TouchableOpacity>

      <Text style={[styles.title, titleStyle]}>{title}</Text>

      <TouchableOpacity onPress={onRightPress}>
        {rightText && <Text style={styles.rightText}>{rightText}</Text>}
      </TouchableOpacity>
    </View>
  );
};

export default HeaderBar;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  icon: {
    width: 18,
    height: 18,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: color.titleColor,
  },
  rightText: {
    color: color.mainColor,
    fontSize: 16,
  },
});
