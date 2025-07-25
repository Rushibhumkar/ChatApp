import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import React from 'react';
import {svgIcons} from '../../assets/svg/svg';
import CustomText from '../CustomText';

interface LabelWithIconProps {
  iconName: keyof typeof svgIcons;
  onPress: () => void;
  customStyling?: ViewStyle;
  disabled?: boolean;
  label: string;
}

const LabelWithIcon: React.FC<LabelWithIconProps> = ({
  iconName,
  onPress,
  customStyling,
  label,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        {backgroundColor: disabled ? '#6434eb90' : '#fff'},
        customStyling,
      ]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled}>
      {React.createElement(svgIcons[iconName], {
        height: 18,
        width: 18,
        fill: '#FFF',
      })}
      <CustomText style={{color: '#6434eb', fontSize: 16}}>{label}</CustomText>
    </TouchableOpacity>
  );
};

export default LabelWithIcon;

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 0.8,
    borderColor: '#6434eb',
  },
});
