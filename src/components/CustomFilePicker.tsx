import React, {useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import {launchImageLibrary} from 'react-native-image-picker';
import {API_AXIOS} from '../api/axiosInstance';
import {myConsole} from '../utils/myConsole';
import {showErrorToast} from '../utils/toastModalFunction';

const CustomFilePicker = ({onClose}: any) => {
  const [file, setFile] = useState<any>(null);
  const [uploading, setUploading] = useState(false);

  const pickFile = async () => {
    try {
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
      });

      if (result.didCancel) return;

      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
        setFile(selectedFile);
      }
    } catch (error) {
      console.error('Error picking file:', error);
      showErrorToast({description: 'Failed to pick a file.'});
    }
  };

  const uploadFile = async () => {
    if (!file) {
      showErrorToast({description: 'Please select a file first.'});
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('files', {
        uri: file.uri,
        type: file.type,
        name: file.fileName || 'upload.jpg',
      });

      const {data} = await API_AXIOS.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      showErrorToast({description: 'File uploaded successfully!'});
      console.log('Upload response:', data);
    } catch (error: any) {
      console.error('Error uploading file:', error.response || error);
      showErrorToast({description: 'Something went wrong while uploading.'});
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={pickFile}>
        <Text style={styles.buttonText}>Pick a File</Text>
      </TouchableOpacity>

      {file && (
        <>
          <Image source={{uri: file.uri}} style={styles.image} />
          <Text style={styles.fileName}>
            {file.fileName || 'Selected File'}
          </Text>
        </>
      )}

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={uploadFile}
        disabled={uploading}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Upload File</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomFilePicker;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: '#28a745',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  fileName: {
    marginTop: 10,
    fontSize: 16,
    color: '#333',
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 10,
    borderRadius: 8,
  },
});
