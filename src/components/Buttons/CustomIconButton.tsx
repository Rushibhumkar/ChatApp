import React from 'react';
import {TouchableOpacity, StyleSheet, ViewStyle} from 'react-native';
import {color} from '../../const/color';
import {svgIcons} from '../../assets/svg/svg';

interface CustomIconButtonProps {
  iconName: keyof typeof svgIcons;
  onPress: () => void;
  customStyling?: ViewStyle;
  disabled?: boolean;
}

const CustomIconButton: React.FC<CustomIconButtonProps> = ({
  iconName,
  onPress,
  customStyling,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {backgroundColor: disabled ? '#6434eb90' : '#6434eb'},
        customStyling,
      ]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}>
      {React.createElement(svgIcons[iconName], {
        height: 24,
        width: 24,
        fill: '#FFF',
      })}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
});

export default CustomIconButton;
