import React, {useState} from 'react';
import {
  View,
  Image,
  TouchableOpacity,
  FlatList,
  Text,
  StyleSheet,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';

const MediaPreview = ({media = []}) => {
  const [orientation, setOrientation] = useState('square');

  const toggleOrientation = () => {
    setOrientation(prev => (prev === 'square' ? 'portrait' : 'square'));
  };

  const openCamera = () => {
    launchCamera({mediaType: 'photo'}, response => {
      if (response.assets) {
        console.log('Camera result:', response.assets[0]);
      }
    });
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={media}
        horizontal
        keyExtractor={item => item.uri}
        renderItem={({item}) => (
          <Image
            source={{uri: item.uri}}
            style={[
              styles.media,
              orientation === 'portrait' && styles.portrait,
            ]}
          />
        )}
      />

      <View style={styles.actions}>
        <TouchableOpacity onPress={toggleOrientation}>
          <Text style={styles.actionText}>Switch: {orientation}</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={openCamera}>
          <Text style={styles.actionText}>Open Camera</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MediaPreview;

const styles = StyleSheet.create({
  container: {padding: 10},
  media: {width: 120, height: 120, marginRight: 10},
  portrait: {height: 160},
  actions: {
    marginTop: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionText: {color: 'blue', fontWeight: 'bold'},
});
