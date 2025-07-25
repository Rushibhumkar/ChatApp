import {useState, useEffect} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';

const useCameraPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    requestCameraPermission();
  }, []);

  const requestCameraPermission = async () => {
    setLoading(true);
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA; // Use correct permission for Android or iOS

      const result = await request(permission);
      handlePermissionResult(result);
    } catch (error) {
      console.error('Permission request failed', error);
    } finally {
      setLoading(false);
    }
  };

  const checkCameraPermission = async () => {
    setLoading(true);
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA; // Use correct permission for Android or iOS

      const result = await check(permission);
      handlePermissionResult(result);
    } catch (error) {
      console.error('Permission check failed', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePermissionResult = (result: string) => {
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
    }
  };

  return {
    hasPermission,
    loading,
    requestCameraPermission,
    checkCameraPermission,
  };
};

export default useCameraPermission;
