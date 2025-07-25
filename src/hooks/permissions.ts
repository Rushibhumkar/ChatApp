import AsyncStorage from '@react-native-async-storage/async-storage';
import {myConsole} from '../utils/myConsole';
import {PermissionsAndroid, Platform} from 'react-native';
import {showErrorToast} from '../utils/toastModalFunction';

export const modifyPermissions = (permissions: Array<any>) => {
  const rolePermissions =
    permissions?.map(
      (permission: Record<any, any>) =>
        `${permission.action}:${permission.resource}`,
    ) || [];
  return rolePermissions;
};

export const getPermissions = async () => {
  try {
    const permissions = await AsyncStorage.getItem('permissions');
    // myConsole('permissionsasd', permissions);
    if (permissions) {
      return JSON.parse(permissions) || [];
    }
    return [];
  } catch (error) {
    console.error('Error reading permissions from AsyncStorage:', error);
    return [];
  }
};

export const setPermissions = async (permissions: Array<any>) => {
  try {
    await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
  } catch (error) {
    console.error('Error saving permissions to AsyncStorage:', error);
  }
};

export const hasActionPermission = async (
  permission: string,
): Promise<boolean> => {
  const permissions = await getPermissions();
  return permissions.includes(permission);
};

export const hasResourcePermission = async (
  moduleName: string,
): Promise<boolean> => {
  if (moduleName.includes('*')) {
    return true;
  }
  const permissions = await getPermissions();
  return permissions.some(item => item.includes(moduleName));
};

export const requestPermissions = async () => {
  if (Platform.OS === 'android') {
    const apiLevel = Platform.Version;
    console.log(`Android API level: ${apiLevel}`);

    if (apiLevel >= 29 && apiLevel < 30) {
      // Scoped storage - Android 10 (API 29)
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log('Write permission granted.');
        return true;
      }
    } else if (apiLevel >= 30) {
      // Android 11+ (requires MANAGE_EXTERNAL_STORAGE for broader file access)
      const isGranted = await PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
      );

      if (!isGranted) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.MANAGE_EXTERNAL_STORAGE,
        );

        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('Managed storage permission granted.');
          return true;
        } else {
          console.log('Managed storage permission denied.');
          showErrorToast({
            description: 'App requires storage permissions to save files.',
          });
          return false;
        }
      } else {
        console.log('Already has manage external storage permission.');
        return true;
      }
    }
  }
};
