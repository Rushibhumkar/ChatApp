import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Button,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import useLocationPermission from '../../hooks/useLocationPermission';
import {myConsole} from '../../utils/myConsole';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {color} from '../../const/color';
import CustomSearch from '../../components/CustomSearch';
import CustomButton from '../../components/Buttons/CustomButton';
import {Google_Maps_Api_Key} from '../../api/axiosInstance';
import CustomText from '../../components/CustomText';
import {shadow} from '../../sharedStyles';
import {Coordinates} from '../../utils/typescriptInterfaces';

const MapScreen = ({navigation, route}: any) => {
  const {onLocationSelect, coors, forSeen = false} = route.params || {};
  const delhiCoordinates: Coordinates = {
    latitude: coors?.latitude || 28.6139,
    longitude: coors?.longitude || 77.209,
  };

  const [selectedLocation, setSelectedLocation] =
    useState<Coordinates>(delhiCoordinates);
  const [mapType, setMapType] = useState<'standard' | 'satellite'>('standard');
  const [locationName, setLocationName] = useState('');
  const {
    hasPermission,
    location,
    loading,
    requestLocationPermission,
    checkLocationPermission,
  } = useLocationPermission();

  const getAddressFromCoords = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${Google_Maps_Api_Key}`,
      );
      const json = await response.json();
      const address = json?.results?.[0]?.formatted_address;
      setLocationName(address);
      console.log('Address:', address);
    } catch (error) {
      console.error('Geocoding failed:', error);
    }
  };

  useEffect(() => {
    if (location && !coors) {
      setSelectedLocation({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      getAddressFromCoords(location.latitude, location.longitude);
    }
  }, [location]);

  if (loading) {
    return <LoadingCompo />;
  }
  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={'#fff'} />
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => navigation.goBack()}>
          <Image
            source={require('../../assets/icons/back.png')}
            style={{height: 22, width: 22}}
          />
        </TouchableOpacity>
        {locationName !== '' && (
          <CustomText style={styles.locNameTxt} numberOfLines={2}>
            {locationName}
          </CustomText>
        )}
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: delhiCoordinates.latitude,
          longitude: delhiCoordinates.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
        mapType={mapType}
        onPress={e => {
          if (forSeen) return; // prevent selection if viewing only
          const coords = e.nativeEvent.coordinate;
          setSelectedLocation({
            latitude: coords.latitude,
            longitude: coords.longitude,
          });
          getAddressFromCoords(coords.latitude, coords.longitude);
        }}>
        <Marker
          coordinate={selectedLocation}
          title="Selected Location"
          description="Tap anywhere to change"
        />
        {/* {location &&
          location.latitude !== undefined &&
          location.longitude !== undefined && (
            <Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              title="Your Location"
              description="This is your current location"
            />
          )} */}
      </MapView>
      <TouchableOpacity
        style={styles.changeMapType}
        activeOpacity={0.6}
        onPress={() =>
          setMapType(mapType === 'satellite' ? 'standard' : 'satellite')
        }>
        <Image
          source={
            mapType === 'satellite'
              ? require('../../assets/icons/standardMap.png')
              : require('../../assets/icons/satelliteMap.png')
          }
          style={{height: 24, width: 24}}
        />
      </TouchableOpacity>
      {!forSeen && (
        <CustomButton
          title="Send"
          onPress={() => {
            const finalLocation = {
              latitude: selectedLocation.latitude,
              longitude: selectedLocation.longitude,
              name: '',
              address: locationName,
            };
            if (onLocationSelect) {
              onLocationSelect(finalLocation);
            }
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  map: {
    width: '100%',
    height: '90%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    position: 'absolute',
    top: 20,
    left: 6,
    zIndex: 20,
    flex: 1,
  },
  backIcon: {
    backgroundColor: '#fff',
    borderRadius: 50,
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  locNameTxt: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    width: '80%',
  },
  changeMapType: {
    position: 'absolute',
    bottom: 140,
    right: 20,
    borderRadius: 50,
    height: 60,
    width: 60,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    ...shadow,
  },
});

export default MapScreen;
