import {Alert} from 'react-native';

export const showConfirmAlert = ({
  title = 'Confirm!',
  message = 'Are you sure?',
  onConfirm,
  cancelText = 'Cancel',
  confirmText = 'Yes',
}: {
  title?: string;
  message: string;
  onConfirm: () => void;
  cancelText?: string;
  confirmText?: string;
}) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: cancelText,
        style: 'cancel',
      },
      {
        text: confirmText,
        onPress: onConfirm,
      },
    ],
    {cancelable: true},
  );
};
