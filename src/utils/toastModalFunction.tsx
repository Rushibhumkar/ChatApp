import {Popup, Toast} from 'react-native-popup-confirm-toast';
import {color} from '../const/color';
import LoadingCompo from '../components/LoadingCompo/LoadingCompo';

interface ConfirmModalProps {
  clickOnConfirm: () => void;
}

interface PlzWaitProps {
  bodyComponent: () => JSX.Element;
}

const successMessage = (message?: string): void => {
  Popup.show({
    type: 'success', // confirm, info, danger, warning, success
    title: 'Successful!',
    textBody: message ?? '---',
    buttonText: 'OK',
    callback: () => Popup.hide(),
    bounciness: 15,
    okButtonStyle: {backgroundColor: 'rgba(3, 161, 0, 1)'},
    iconHeaderStyle: {
      marginBottom: -10,
    },
  });
};

const errorMessage = (message?: string): void => {
  Popup.show({
    type: 'danger', // confirm, info, danger, warning, success
    title: 'Error!',
    textBody: message ?? 'Server Error please try again',
    buttonText: 'OK',
    callback: () => Popup.hide(),
    bounciness: 15,
    okButtonStyle: {backgroundColor: '#A7100A'},
    iconHeaderStyle: {
      marginBottom: -10,
    },
  });
};
const hidePopupSafely = (): void => {
  Popup.hide();
  setTimeout(() => {
    console.log('Popup closed safely');
  }, 100); // Give RN time to remove overlay
};

const confirmModal = ({
  clickOnConfirm,
  textBody = 'Do you want to delete users',
  buttonText = 'Confirm',
}: ConfirmModalProps & {textBody?: string; buttonText?: string}): void => {
  Popup.show({
    type: 'confirm',
    title: 'Confirm!',
    textBody,
    buttonText,
    confirmText: 'Cancel',
    callback: () => {
      hidePopupSafely(); // hide + wait
      setTimeout(() => {
        clickOnConfirm();
      }, 150); // slight delay for safety
    },
    cancelCallback: () => {
      hidePopupSafely();
    },
    buttonContentStyle: {
      flexDirection: 'row',
      gap: 20,
    },
    iconHeaderStyle: {
      marginBottom: -10,
    },
    okButtonStyle: {backgroundColor: '#DC7331'},
    confirmButtonStyle: {borderColor: 'black', borderWidth: 1},
  });
};

const waitingModal = (): void => {
  Popup.show({
    type: 'success', // confirm, info, danger, warning, success
    title: 'Successful!',
    textBody: 'Successfully processed.',
    buttonText: 'OK',
    callback: () => Popup.hide(),
    bounciness: 15,
    okButtonStyle: {backgroundColor: 'rgba(3, 161, 0, 1)'},
    iconHeaderStyle: {
      marginBottom: -10,
    },
  });
};
const confFormValidation = (title, message): void => {
  Popup.show({
    type: 'warning',
    title: title ?? 'Action Required',
    textBody: message ?? 'Please fill out the form to continue',
    buttonText: 'OK',
    callback: () => Popup.hide(),
  });
};

const subTypeValidation = (title, message): void => {
  Popup.show({
    type: 'warning',
    title: title ?? 'Action Required',
    textBody: message ?? '---',
    buttonText: 'OK',
    callback: () => Popup.hide(),
  });
};

const plzWait = (): void => {
  Popup.show({
    bodyComponent: () => <LoadingCompo />,
    iconEnabled: false,
    buttonEnabled: false,
    modalContainerStyle: {
      backgroundColor: 'transparent',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
    },
  });
};

export const showSuccessToast = ({
  description = '',
  timing = 1500,
  position = 'top',
  backgroundColor = color.success,
  textColor = '#FFFFFF',
  height = 60,
}: {
  description?: string;
  timing?: number;
  position?: 'bottom' | 'top';
  backgroundColor?: string;
  textColor?: string;
  height?: any;
}) => {
  Toast.show({
    text: description,
    timing,
    position,
    backgroundColor,
    statusBarHidden: true,
    descTextStyle: {
      color: textColor,
      fontSize: 14,
    },
    statusBarType: 'dark-content',
  });
};

export const showErrorToast = ({
  title = '',
  description = '',
  timing = 1500,
  position = 'top',
  backgroundColor = color.danger,
  textColor = '#FFFFFF',
}: {
  title?: string;
  description?: string;
  timing?: number;
  position?: 'bottom' | 'top';
  backgroundColor?: string;
  textColor?: string;
}) => {
  Toast.show({
    title,
    text: description,
    timing,
    position,
    backgroundColor,
    titleTextStyle: {
      color: textColor,
      fontSize: 16,
      fontWeight: 'bold',
    },
    descTextStyle: {
      color: textColor,
      fontSize: 14,
    },
    statusBarType: 'dark-content',
  });
};

export const showWarningToast = ({
  description = '',
  timing = 1500,
  position = 'top',
  backgroundColor = '#FFD700', // Bright yellow
  textColor = '#000000', // Black text for contrast
  height = 60,
}: {
  description?: string;
  timing?: number;
  position?: 'bottom' | 'top';
  backgroundColor?: string;
  textColor?: string;
  height?: any;
}) => {
  Toast.show({
    text: description,
    timing,
    position,
    backgroundColor,
    statusBarHidden: true,
    descTextStyle: {
      color: textColor,
      fontSize: 14,
    },
    statusBarType: 'dark-content',
  });
};

interface TIsConfirm {
  onConfirm: () => void;
  title?: string;
}

const wantDelete = ({
  onConfirm,
  title = 'Do you want to Delete!',
}: TIsConfirm): void =>
  Popup.show({
    type: 'confirm',
    title: title,
    buttonText: 'Yes',
    confirmText: 'No',
    callback: () => {
      onConfirm && onConfirm();
    },
    cancelCallback: () => {
      Popup.hide();
    },
    buttonContentStyle: {
      flexDirection: 'row',
      gap: 20,
    },
    okButtonStyle: {backgroundColor: color.red},
    confirmButtonStyle: {backgroundColor: color.grayBtn},
  });

const popUpClose = (): void => {
  Popup.hide();
};

export const popUpConfToast = {
  successMessage,
  errorMessage,
  confirmModal,
  plzWait,
  waitingModal,
  popUpClose,
  confFormValidation,
  subTypeValidation,
  wantDelete,
};

export const showSuccess = successMessage;
export const showError = errorMessage;
