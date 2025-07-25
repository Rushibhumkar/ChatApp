import React from 'react';
import {
  View,
  Text,
  Switch,
  StyleSheet,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {color} from '../const/color';

interface CustomSwitchProps {
  customStyling?: StyleProp<ViewStyle>;
  label?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}

const CustomSwitch: React.FC<CustomSwitchProps> = ({
  label,
  value,
  onValueChange,
  customStyling,
}) => {
  return (
    <View style={[styles.container, customStyling]}>
      <Text style={styles.label}>{label}</Text>
      <Switch
        trackColor={{false: '#ddd', true: color.mainColor}}
        thumbColor={value ? '#fff' : '#f4f3f4'}
        ios_backgroundColor="#3e3e3e"
        onValueChange={onValueChange}
        value={value}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  label: {
    color: '#000',
    fontSize: 16,
  },
});

export default CustomSwitch;
