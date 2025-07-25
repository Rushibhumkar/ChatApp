import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  Platform,
} from 'react-native';
import {color} from '../const/color';

interface CustomPhoneInputProps {
  label?: string;
  name?: string;
  formik?: any;
  placeholder?: string;
  mt?: number;
  customStyling?: ViewStyle;
  customInputStyle?: ViewStyle;
  disabled?: boolean;
}

const CustomPhoneInput: React.FC<CustomPhoneInputProps> = ({
  label,
  name = 'phone',
  formik,
  placeholder = 'Enter phone number',
  mt = 12,
  customStyling,
  customInputStyle,
  disabled = false,
}) => {
  const value = formik?.values?.[name] || '';
  const error = formik?.errors?.[name];
  const touched = formik?.touched?.[name];

  const handleInputChange = (text: string) => {
    const numeric = text.replace(/[^0-9]/g, '').slice(0, 10); // Indian number: 10 digits
    formik.setFieldValue(name, numeric);
  };

  return (
    <View style={[styles.container, {marginTop: mt, marginBottom: 8}]}>
      {label && <Text style={styles.label}>{label}</Text>}

      <View style={[styles.row, customStyling]}>
        <View style={styles.countryCodeContainer}>
          <Text style={styles.countryCodeText}>+91</Text>
        </View>
        <TextInput
          style={[
            styles.input,
            customInputStyle,
            disabled && {backgroundColor: '#f0f0f0'},
          ]}
          placeholder={placeholder}
          placeholderTextColor={color.placeholderColor || '#888'}
          value={value}
          onChangeText={handleInputChange}
          onBlur={() => formik.setFieldTouched(name)}
          keyboardType="number-pad"
          maxLength={10}
          editable={!disabled}
        />
      </View>

      {error && touched && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  label: {
    color: '#000',
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 2,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  countryCodeContainer: {
    paddingHorizontal: 10,
    paddingVertical: Platform.OS === 'ios' ? 12 : 8,
    backgroundColor: '#eee',
    borderTopLeftRadius: 8,
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderRightWidth: 0,
    borderColor: color.placeholderColor || '#ccc',
  },
  countryCodeText: {
    color: '#000',
    fontSize: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.placeholderColor || '#ccc',
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#000',
    height: 40,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default CustomPhoneInput;
