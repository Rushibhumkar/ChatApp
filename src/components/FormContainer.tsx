import React from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  ViewStyle,
  StyleProp,
  Platform,
} from 'react-native';
import {sizes} from '../const';

interface FormContainerProps {
  children: React.ReactNode;
  customStyling?: StyleProp<ViewStyle>;
}

const FormContainer: React.FC<FormContainerProps> = ({
  children,
  customStyling,
}) => {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.container, customStyling]}>
      <ScrollView
        contentContainerStyle={{flexGrow: 1, paddingBottom: 40}}
        keyboardShouldPersistTaps="handled"
        style={{paddingHorizontal: 16}}>
        {children}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default FormContainer;

const styles = StyleSheet.create({
  container: {
    width: sizes.width,
    flex: 1,
    backgroundColor: '#fff',
  },
});
