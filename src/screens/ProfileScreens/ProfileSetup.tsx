import React, {useEffect, useMemo, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  BackHandler,
} from 'react-native';
import {useFormik} from 'formik';
import MainContainer from '../../components/MainContainer';
import {
  updateUserData,
  useGetMyData,
  useGetProfileDynamicSchema,
} from '../../api/profile/profileFunc';
import {myConsole} from '../../utils/myConsole';
import CustomAvatar from '../../components/CustomAvatar';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import CustomDatePicker from '../../components/CustomDatePicker';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import {convertToLowerCase} from '../../utils/commonFunction';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import {useQueryClient} from '@tanstack/react-query';
import {API_AXIOS, fileViewURL} from '../../api/axiosInstance';
import {launchImageLibrary} from 'react-native-image-picker';

const ProfileSetup = ({navigation}: any) => {
  const {
    data: schema,
    isLoading: schemaLoading,
    isError: schemaError,
    error,
  } = useGetProfileDynamicSchema();
  const {
    data: myData,
    isLoading: myDataLoading,
    isError: myDataError,
  } = useGetMyData();

  useEffect(() => {
    const backAction = () => true;
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, []);
  const queryClient = useQueryClient();
  const [dataLoading, setDataLoading] = useState(false);
  const [uploadedFilePath, setUploadedFilePath] = useState<string | null>(null);
  const [fileUploadLoad, setFileUploadLoad] = useState<boolean>(false);
  const fields = schema?.data || [];

  const initialValues = useMemo(() => {
    return {
      ...fields.reduce((acc: any, field: any) => {
        acc[field.name] = myData?.data?.dynamicData?.[field.name] || '';
        return acc;
      }, {}),
    };
  }, [fields, myData]);
  const handleSubmit = useCallback(
    async (values: any) => {
      const formattedValues = {
        firstName: myData?.data?.firstName || undefined,
        middleName: myData?.data?.middleName || undefined,
        lastName: myData?.data?.lastName || undefined,
        gender: myData?.data?.gender || undefined,
        phone: myData?.data?.phone || undefined,
        profileImageUrl: uploadedFilePath
          ? `${fileViewURL}${uploadedFilePath}`
          : myData?.data?.profileImageUrl,
        dynamicData: {...values},
      };
      setDataLoading(true);
      try {
        await updateUserData(myData?.data?._id, formattedValues);
        queryClient.invalidateQueries({queryKey: ['myData']});
        showSuccessToast({description: 'Profile Updated Successfully'});
        navigation.goBack();
      } catch (error) {
        console.error('Failed to update profile:', error);
      } finally {
        setDataLoading(false);
      }
    },
    [myData?.data?._id, uploadedFilePath], // Add uploadedFilePath as a dependency
  );

  const formik = useFormik({
    initialValues,
    enableReinitialize: true,
    onSubmit: handleSubmit,
    validateOnChange: false,
  });

  const handleChange = useCallback(
    (fieldName: string, value: string) => {
      formik.setValues((prevValues: any) => ({
        ...prevValues,
        dynamicData: {
          ...prevValues.dynamicData,
          [fieldName]: value,
        },
      }));
    },
    [formik],
  );
  const pickFile = async () => {
    try {
      setFileUploadLoad(true);
      const result = await launchImageLibrary({
        mediaType: 'photo',
        includeBase64: false,
      });
      if (result.didCancel) return;
      if (result.assets && result.assets.length > 0) {
        const selectedFile = result.assets[0];
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
          const uploadedFilePath = data.data.files[0]; // Ensure this path is correct
          setUploadedFilePath(uploadedFilePath);

          try {
            await updateUserData(myData?.data?._id, {
              profileImageUrl: `${fileViewURL}${uploadedFilePath}`,
            });
            queryClient.invalidateQueries({queryKey: ['myData']});
            showSuccessToast({
              description: 'Profile Photo Updated Successfully',
            });
            navigation.goBack();
          } catch (error) {
            console.error('Failed to update profile photo:', error);
          }
          // formik.handleSubmit();
        }
      }
    } catch (error) {
      console.error('Error picking or uploading file:', error);
      showErrorToast({description: 'Failed to pick or upload the file.'});
    } finally {
      setFileUploadLoad(false);
    }
  };

  const renderFields = useMemo(() => {
    return fields.map((field: any) => (
      <ProfileField
        key={field._id}
        field={field}
        formik={formik}
        handleChange={handleChange}
      />
    ));
  }, [fields, formik]);

  if (schemaLoading || myDataLoading) {
    return (
      <MainContainer isBack title="Setup Profile">
        <LoadingCompo />
      </MainContainer>
    );
  }

  if (schemaError || myDataError) {
    return (
      <MainContainer isBack title="Setup Profile">
        <Text>
          Error loading profile schema: {error?.message || 'Unknown error'}
        </Text>
      </MainContainer>
    );
  }
  return (
    <MainContainer isBack title="Setup Profile">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.avatarCont}>
          <CustomAvatar
            name="Rushi"
            style={styles.avatarStyle}
            imgUrl={myData?.data?.profileImageUrl}
            imgLoader={fileUploadLoad}
          />
          <TouchableOpacity style={styles.editView} onPress={pickFile}>
            <Image
              source={require('../../assets/icons/edit.png')}
              style={styles.editIcon}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.formContainer}>
          {renderFields}
          <CustomButton
            title="Submit"
            onPress={formik.handleSubmit}
            loading={dataLoading}
          />
        </View>
      </ScrollView>
    </MainContainer>
  );
};

// ✅ ProfileField ensures consistent rendering and prevents Hook Order issues
const ProfileField = React.memo(({field, formik, handleChange}: any) => {
  return (
    <View>
      {field.subType === 'date' ? (
        <CustomDatePicker
          field={field}
          formik={formik}
          minDate={new Date(1920, 0, 1)}
          maxDate={new Date(2016, 0, 1)}
          placeholder={`Select ${convertToLowerCase(field.label)}`}
        />
      ) : (
        <CustomTextInput
          field={field}
          formik={formik}
          placeholder={`Enter ${convertToLowerCase(field.label)}`}
        />
      )}
    </View>
  );
});

export default ProfileSetup;

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 30,
  },
  avatarCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingVertical: 20,
  },
  avatarStyle: {
    height: 100,
    width: 100,
  },
  editView: {
    backgroundColor: '#fff',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOpacity: 0.8,
    elevation: 4,
    padding: 4,
    position: 'relative',
    bottom: 32,
    right: -28,
  },
  editIcon: {
    height: 24,
    width: 24,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  submitButton: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
