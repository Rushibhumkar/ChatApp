import React from 'react';
import {
  TouchableOpacity,
  Text,
  ActivityIndicator,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import {Popup} from 'react-native-popup-confirm-toast';
import {myConsole} from '../../utils/myConsole';
import {color} from '../../const/color';

interface CustomButtonProps {
  title: string;
  onPress: () => void;
  customStyling?: ViewStyle;
  disabled?: boolean;
  loading?: boolean;
  textStyle?: TextStyle;
  mt?: any;
  alignSelef?:
    | 'auto'
    | 'flex-start'
    | 'center'
    | 'flex-end'
    | 'stretch'
    | 'baseline';
}

const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  textStyle,
  customStyling,
  loading = false,
  disabled = loading,
  mt = 40,
}) => {
  return (
    <TouchableOpacity
      style={[
        {
          opacity: disabled ? 0.6 : 1,
          marginTop: mt,
          backgroundColor: color.mainColor,
          justifyContent: 'center',
          alignItems: 'center',
          paddingVertical: 8,
          alignSelf: 'auto',
          borderRadius: 8,
          paddingHorizontal: 22,
        },
        customStyling,
      ]}
      activeOpacity={0.6}
      onPress={onPress}
      disabled={disabled || loading}>
      {loading ? (
        <ActivityIndicator size="small" color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  gradient: {
    borderRadius: 8,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CustomButton;
