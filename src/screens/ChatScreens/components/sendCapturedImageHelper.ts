import RNFS from 'react-native-fs';
import {API_AXIOS} from '../../../api/axiosInstance';
import {showErrorToast} from '../../../utils/toastModalFunction';

export const sendCapturedImageHelper = async ({
  uri,
  onSuccess,
  onError,
}: {
  uri: string;
  onSuccess: (fileData: {
    attachments: {
      path: string;
      size: string;
      mimeType: string;
      fileName: string;
    }[];
  }) => void;
  onError?: () => void;
}) => {
  if (!uri.startsWith('file://')) return;

  const filePath = uri.replace('file://', '');
  const pathSegments = filePath.split('/');
  const fileName = pathSegments[pathSegments.length - 1];
  const destFilePath = `${RNFS.DownloadDirectoryPath}/${fileName}`;

  try {
    await RNFS.moveFile(filePath, destFilePath);
    const updatedUri = `file://${destFilePath}`;

    const formData = new FormData();
    formData.append('files', {
      uri: updatedUri,
      type: 'image/jpeg',
      name: fileName,
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
        size: 'unknown',
        mimeType: 'image/jpeg',
        fileName,
      };

      onSuccess({attachments: [attachment]});
    } else {
      showErrorToast({description: 'Failed to upload the image.'});
      onError?.();
    }
  } catch (error) {
    console.error('Error saving or uploading captured image:', error);
    showErrorToast({description: 'Error while saving or uploading the image.'});
    onError?.();
  }
};
