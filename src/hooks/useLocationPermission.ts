import {useState, useEffect} from 'react';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import {Platform} from 'react-native';
import Geolocation from '@react-native-community/geolocation';

const useLocationPermission = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [location, setLocation] = useState<any | null>(null);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  // Request location permission
  const requestLocationPermission = async () => {
    setLoading(true);
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION; // For Android, use ACCESS_FINE_LOCATION

      const result = await request(permission); // Request permission for the respective platform
      handlePermissionResult(result);
    } catch (error) {
      console.error('Permission request failed', error);
    } finally {
      setLoading(false);
    }
  };

  // Check location permission
  const checkLocationPermission = async () => {
    setLoading(true);
    try {
      const permission =
        Platform.OS === 'ios'
          ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
          : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION; // For Android, use ACCESS_FINE_LOCATION

      const result = await check(permission);
      handlePermissionResult(result);
    } catch (error) {
      console.error('Permission check failed', error);
    } finally {
      setLoading(false);
    }
  };

  // Handle the result of permission request
  const handlePermissionResult = (result: string) => {
    if (result === RESULTS.GRANTED) {
      setHasPermission(true);
      getCurrentLocation(); // If permission is granted, fetch the location
    } else {
      setHasPermission(false);
    }
  };

  // Get the current location using Geolocation
  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLocation(position.coords);
        console.log('Current Location:', position.coords); // Log location data
      },
      error => {
        console.error(error);
        setLocation(null); // If an error occurs while fetching location
      },
    );
  };

  return {
    hasPermission,
    location,
    loading,
    requestLocationPermission,
    checkLocationPermission,
  };
};

export default useLocationPermission;
