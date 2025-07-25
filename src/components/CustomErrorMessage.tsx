import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ViewStyle,
} from 'react-native';
import {color} from '../const/color';
import {myConsole} from '../utils/myConsole';
import {sizes} from '../const';

interface CustomErrorMessageProps {
  message: string;
  onRetry?: () => void;
  style?: ViewStyle;
  height?: number;
}

const CustomErrorMessage: React.FC<CustomErrorMessageProps> = ({
  message,
  onRetry,
  style,
  height = sizes.height - 40,
}) => {
  return (
    <View style={[styles.container, style, {height}]}>
      {message && <Text style={styles.errorText}>{message}</Text>}
      {onRetry && (
        <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
          <Text style={styles.retryText}>Try Again</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CustomErrorMessage;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    height: sizes.height - 40,
  },
  errorText: {
    fontSize: 16,
    color: 'tomato',
    marginBottom: 12,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: color.mainColor,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 6,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
