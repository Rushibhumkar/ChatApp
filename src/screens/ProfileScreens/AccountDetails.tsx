import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from 'react-native';
import React, {useState} from 'react';
import MainContainer from '../../components/MainContainer';
import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/Buttons/CustomButton';
import {profileRoute} from '../AuthScreens/routeName';
import CustomDataListing from '../../components/CustomDataListing';
import {useGetMyData} from '../../api/profile/profileFunc';
import {color} from '../../const/color';
import {capitalizeFirstLetter} from '../../utils/commonFunction';
import {showErrorToast} from '../../utils/toastModalFunction';
import {API_AXIOS, fileViewURL} from '../../api/axiosInstance';
import {launchImageLibrary} from 'react-native-image-picker';
import {myConsole} from '../../utils/myConsole';
import {useQueryClient} from '@tanstack/react-query';
import LoadingCompo from '../../components/LoadingCompo/LoadingCompo';
import {sizes} from '../../const';
import CustomErrorMessage from '../../components/CustomErrorMessage';

const AccountDetails = ({navigation}: any) => {
  const queryClient = useQueryClient();
  // const {
  //   data: myData,
  //   isLoading: myDataLoading,
  //   isError: myDataError,
  //   refetch,
  // } = useGetMyData();

  const {
    data: myData,
    isLoading: myDataLoad,
    isError: myDataErr,
    refetch: myDataRefetch,
  } = useGetMyData();

  const user = myData?.data || {};
  const firstName = user.firstName || 'N/A';
  const middleName = user.middleName || 'N/A';
  const lastName = user.lastName || 'N/A';
  const phone = user.phone || 'N/A';
  const gender = capitalizeFirstLetter(user.gender) || 'N/A';
  const createdAt = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString()
    : 'N/A';

  const dynamicDataEntries = Object.entries(user.dynamicData || {}).map(
    ([key, value]) => ({
      label: capitalizeFirstLetter(key.replace(/([A-Z])/g, ' $1').trim()),
      value: value || 'N/A',
    }),
  );
  // Data for listing
  const datam = [
    {label: 'First name', value: firstName},
    {label: 'Middle name', value: middleName},
    {label: 'Last name', value: lastName},
    {label: 'Phone', value: phone},
    {label: 'Gender', value: gender},
    ...dynamicDataEntries,
    // {label: 'Account Created', value: createdAt},
  ];

  const socialMediaData = [
    {label: 'Instagram', value: 'https://instagram.com'},
    {label: 'Facebook', value: 'https://facebook.com'},
  ];

  const [file, setFile] = useState<any>(null);
  const [fileUploadLoad, setFileUploadLoad] = useState<boolean>(false);

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
          const uploadedFilePath = data.data.files[0];

          const attachment = {
            path: uploadedFilePath,
            size: selectedFile.fileSize?.toString() || '',
            mimeType: selectedFile.type || '',
            fileName: selectedFile.fileName || 'upload.jpg',
          };
          setFile({
            ...selectedFile,
            attachments: [attachment],
          });
          queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
        }
      }
    } catch (error) {
      console.error('Error picking or uploading file:', error);
      showErrorToast({description: 'Failed to pick or upload the file.'});
    } finally {
      setFileUploadLoad(false);
    }
  };
  return (
    <MainContainer
      isBack
      title="Account Details"
      showRightIcon={
        myData
          ? [
              {
                imageSource: require('../../assets/icons/edit.png'),
                onPress: () => navigation.navigate(profileRoute.ProfileSetup),
              },
            ]
          : []
      }>
      {myDataLoad && <LoadingCompo minHeight={sizes.height / 1.1} />}
      {myDataErr && (
        <CustomErrorMessage
          message="Failed to fetch data. Please try again."
          onRetry={myDataRefetch}
        />
      )}
      <ScrollView
        style={{backgroundColor: '#fff', paddingHorizontal: 16}}
        contentContainerStyle={{paddingBottom: 40}}>
        <View style={styles.avatarCont}>
          <CustomAvatar
            imgUrl={user.profileImageUrl}
            name={user.firstName || 'User'}
            style={{height: 100, width: 100, marginBottom: 20}}
            mb={20}
            imgLoader={fileUploadLoad}
            // disabled={!Boolean(file?.attachments[0]?.path)}
          />
          {/* <TouchableOpacity style={styles.editView} onPress={pickFile}>
            <Image
              source={require('../../assets/icons/edit.png')}
              style={{height: 24, width: 24}}
            />
          </TouchableOpacity> */}
        </View>

        {myData?.data && (
          <View style={styles.countContainer}>
            <Text
              style={styles.countText}
              onPress={() =>
                navigation.navigate(profileRoute.ProfileStack, {
                  screen: profileRoute.FollowersFollowing,
                  params: {
                    data: myData?.data?.followers,
                    titleName: 'followers',
                  },
                })
              }>
              Followers: {myData?.data?.totalFollowers}
            </Text>
            <Text
              style={styles.countText}
              onPress={() =>
                navigation.navigate(profileRoute.ProfileStack, {
                  screen: profileRoute.FollowersFollowing,
                  params: {
                    data: myData?.data?.following,
                    titleName: 'followings',
                  },
                })
              }>
              Following: {myData?.data?.totalFollowing}
            </Text>
          </View>
        )}

        <CustomDataListing
          data={datam}
          customViewStyling={{paddingHorizontal: 40}}
        />

        <CustomDataListing
          data={socialMediaData}
          customViewStyling={{paddingHorizontal: 40}}
          showCopyIcon
        />

        <CustomButton
          title="Add more data"
          onPress={() => navigation.navigate(profileRoute.ProfileSetup)}
        />
      </ScrollView>
    </MainContainer>
  );
};

export default AccountDetails;

const styles = StyleSheet.create({
  avatarCont: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
    paddingTop: 20,
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
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: color.mainColor,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: 'red',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorDetails: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
    textAlign: 'center',
  },
  countContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  countText: {
    fontSize: 16,
    fontWeight: 'bold',
    backgroundColor: color.smoothBg,
    paddingVertical: 8,
    paddingHorizontal: 40,
    borderRadius: 50,
    color: '#000',
  },
});
