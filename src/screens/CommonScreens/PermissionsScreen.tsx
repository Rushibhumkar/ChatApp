import React, {useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import useLocationPermission from '../../hooks/useLocationPermission';
import useCameraPermission from '../../hooks/useCameraPermission';

const PermissionsScreen = () => {
  // Camera Permission Hook
  const {
    hasPermission: hasCameraPermission,
    loading: loadingCamera,
    requestCameraPermission,
    checkCameraPermission,
  } = useCameraPermission();

  // Location Permission Hook
  const {
    hasPermission: hasLocationPermission,
    location,
    loading: loadingLocation,
    requestLocationPermission,
    checkLocationPermission,
  } = useLocationPermission();

  // Effect to log the permission and location details
  useEffect(() => {
    console.log('Camera Permission:', hasCameraPermission);
    console.log('Location Permission:', hasLocationPermission);
    if (location) {
      console.log('Location Data:', location);
    }
  }, [hasCameraPermission, hasLocationPermission, location]);

  return (
    <View style={styles.container}>
      {/* Camera Permission Section */}
      <View style={styles.permissionSection}>
        <Text style={styles.header}>Camera Permission</Text>
        {loadingCamera ? (
          <Text>Loading camera permission...</Text>
        ) : hasCameraPermission === null ? (
          <Text>Requesting camera permission...</Text>
        ) : hasCameraPermission ? (
          <Text>Camera Permission Granted</Text>
        ) : (
          <Text>Camera Permission Denied</Text>
        )}
        <Button
          title="Request Camera Permission"
          onPress={requestCameraPermission}
        />
        <Button
          title="Check Camera Permission"
          onPress={checkCameraPermission}
        />
      </View>

      {/* Location Permission Section */}
      <View style={styles.permissionSection}>
        <Text style={styles.header}>Location Permission</Text>
        {loadingLocation ? (
          <Text>Loading location permission...</Text>
        ) : hasLocationPermission === null ? (
          <Text>Requesting location permission...</Text>
        ) : hasLocationPermission ? (
          <Text>Location Permission Granted</Text>
        ) : (
          <Text>Location Permission Denied</Text>
        )}
        {location && (
          <Text>
            Current Location: {location.latitude}, {location.longitude}
          </Text>
        )}
        <Button
          title="Request Location Permission"
          onPress={requestLocationPermission}
        />
        <Button
          title="Check Location Permission"
          onPress={checkLocationPermission}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  permissionSection: {
    marginBottom: 20,
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PermissionsScreen;
