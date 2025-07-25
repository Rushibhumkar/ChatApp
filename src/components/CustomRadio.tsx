import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {color} from '../const/color';

interface CustomRadioProps {
  title: string;
  options: {label: string; value: string}[];
  selectedValue: string;
  onSelect: (value: string) => void;
}

const CustomRadio: React.FC<CustomRadioProps> = ({
  title,
  options,
  selectedValue,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      {options.map(option => (
        <TouchableOpacity
          key={option.value}
          style={styles.optionContainer}
          onPress={() => onSelect(option.value)}>
          <View
            style={[
              styles.radio,
              selectedValue === option.value && styles.radioSelected,
            ]}
          />
          <Text style={styles.optionText}>{option.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  title: {
    color: color.mainColor,
    fontWeight: '600',
    marginBottom: 5,
  },
  optionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  radio: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: color.mainColor,
    marginRight: 10,
  },
  radioSelected: {
    backgroundColor: color.mainColor,
  },
  optionText: {
    color: '#000',
    fontSize: 16,
  },
});

export default CustomRadio;
