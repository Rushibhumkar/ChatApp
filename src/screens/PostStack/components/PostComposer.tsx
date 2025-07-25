import React from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import CustomText from '../../../components/CustomText';
import {color} from '../../../const/color';

const PostComposer = ({onShowHidePress}: any) => {
  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Write a caption..."
        placeholderTextColor={color.placeholderColor}
        style={styles.input}
        multiline
      />
      <TouchableOpacity style={styles.linkRow}>
        <Image
          source={require('../../../assets/icons/user.png')}
          style={styles.icon}
        />
        <CustomText style={styles.linkText}>Tag People</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow}>
        <Image
          source={require('../../../assets/icons/location.png')}
          style={styles.icon}
        />
        <CustomText style={styles.linkText}>Add Location</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow} onPress={onShowHidePress}>
        <Image
          source={require('../../../assets/icons/users.png')}
          style={styles.icon}
        />
        <CustomText style={styles.linkText}>Show / Hide</CustomText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.linkRow}>
        <CustomText style={styles.linkText}># Hashtags</CustomText>
      </TouchableOpacity>
    </View>
  );
};

export default PostComposer;

const styles = StyleSheet.create({
  container: {padding: 16},
  input: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 16,
    color: '#000',
  },
  linkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
    resizeMode: 'contain',
  },
  linkText: {fontSize: 16},
  showHideBtn: {marginTop: 20},
});
