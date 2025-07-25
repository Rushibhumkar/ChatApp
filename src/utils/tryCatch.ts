import {popUpConfToast, showError, showSuccess} from './toastModalFunction';

interface tryCatchType {
  api: () => Promise<any>;
  message?: string;
  onError?: (err: any) => void;
  onSuccess?: (err: any) => void;

  hideMsg?: boolean;
  showLoader?: boolean; // New prop to decide whether to show loader
}

export const tryCatch = async ({
  api,
  message,
  onError,
  onSuccess,
  hideMsg = false,
  showLoader = false, // Default to true for showing loader
}: tryCatchType) => {
  if (showLoader) {
    popUpConfToast.plzWait(); // Show loading popup if showLoader is true
  }

  try {
    const res = await api(); // API call
    const data = res?.data;
    onSuccess && onSuccess(res);
    if (message) {
      showSuccess(message);
    } else if (data?.message) {
      !hideMsg && showSuccess(data.message);
    } else {
      !hideMsg && showSuccess('Operation successful!');
    }
    return data;
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message || error.message || 'Something went wrong';
    if (onError) {
      onError(error);
    } else {
      error?.status !== 500 &&
        errorMessage !== 'Network Error' &&
        showError(errorMessage);
    }
    throw new Error(errorMessage);
  } finally {
    if (showLoader) {
      popUpConfToast.popUpClose(); // Close popup in the `finally` block to ensure it closes after API call
    }
  }
};
