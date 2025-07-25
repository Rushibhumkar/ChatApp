import {launchImageLibrary} from 'react-native-image-picker';
import {API_AXIOS} from '../../../api/axiosInstance';
import {showErrorToast} from '../../../utils/toastModalFunction';

export const pickFileHelper = async ({
  onSuccess,
  onStartUpload,
  onFinishUpload,
}: {
  onSuccess: (fileData: {
    uri: string;
    type: string;
    fileName: string;
    fileSize?: number;
    attachments: {
      path: string;
      size: string;
      mimeType: string;
      fileName: string;
    }[];
  }) => void;
  onStartUpload?: () => void;
  onFinishUpload?: () => void;
}) => {
  try {
    const result = await launchImageLibrary({
      mediaType: 'mixed',
      includeBase64: false,
      selectionLimit: 1,
    });

    if (result.didCancel) return;

    if (result.assets && result.assets.length > 0) {
      const selectedFile = result.assets[0];

      onStartUpload?.();

      const formData = new FormData();
      formData.append('files', {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.fileName || 'upload.jpg',
      });

      const {data} = await API_AXIOS.post('/file/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (data?.success && data?.data?.files?.length > 0) {
        const uploadedFilePath = data.data.files[0];

        const attachment = {
          path: uploadedFilePath,
          size: selectedFile.fileSize?.toString() || '',
          mimeType: selectedFile.type || '',
          fileName: selectedFile.fileName || 'upload.jpg',
        };

        onSuccess({
          uri: selectedFile.uri,
          type: selectedFile.type || '',
          fileName: selectedFile.fileName || 'upload.jpg',
          fileSize: selectedFile.fileSize,
          attachments: [attachment],
        });
      }
    }
  } catch (error) {
    console.error('Error picking or uploading file:', error);
    showErrorToast({description: 'Failed to pick or upload the file.'});
  } finally {
    onFinishUpload?.();
  }
};
