import {Image, Linking, StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useState} from 'react';
import {ScrollView} from 'react-native-gesture-handler';
import CustomAvatar from '../../components/CustomAvatar';
import CustomText from '../../components/CustomText';
import {color} from '../../const/color';
import {chatRoute, homeRoute} from '../AuthScreens/routeName';
import CustomDataListing from '../../components/CustomDataListing';
import {myConsole} from '../../utils/myConsole';
import NoDataFound from '../../components/NoDataFound';
import {
  cancelFollowRequest,
  sendFollowRequest,
  useIsFollowerIsFollowing,
} from '../../api/follow/followFunc';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';
import {useQueryClient} from '@tanstack/react-query';
import OnlyLoader from '../../components/LoadingCompo/OnlyLoader';
import {myStyle} from '../../sharedStyles';
import {useGetUserById} from '../../api/user/userFunc';
import {getValue} from '../../utils/commonFunction';

const UsersProfileDetails = ({navigation, route}: any) => {
  const {
    id,
    data,
    showBasicDetails = false,
    showFullInfo = false,
    showSocialMedia = false,
    showRelation = false,
    showHierarchy = false,
    request = false,
    showChatIcon = true,
  } = route.params;
  const queryClient = useQueryClient();
  const {
    data: isFollowerIsFollowingData,
    isLoading: isFIsFLoad,
    isError: isFIsFErr,
  } = useIsFollowerIsFollowing(data?._id);
  const [followReqLoading, setFollowReqLoading] = useState(false);
  const [cancelReqLoad, setCancelReqLoad] = useState(false);

  const {
    data: userData,
    isLoading: userDataLoad,
    isError: userDataErr,
    refetch: userDataRefetch,
  } = useGetUserById(id ? id : null);

  // const handleSendFollowRequest = async () => {
  //   setFollowReqLoading(true);
  //   try {
  //     await sendFollowRequest(data?._id);
  //     // queryClient.invalidateQueries({queryKey:['followData']});
  //     queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
  //     showSuccessToast({description: 'Follow request sent successfully'});
  //   } catch (error) {
  //     console.error('Error sending follow request:', error);
  //   } finally {
  //     setFollowReqLoading(false);
  //   }
  // };

  const handleFollowAction = async () => {
    setFollowReqLoading(true);
    try {
      if (isFollowerIsFollowingData?.data?.following?.status === 'accepted') {
        showSuccessToast({description: 'You are following back'});
      } else if (
        isFollowerIsFollowingData?.data?.following?.status === 'pending'
      ) {
        showSuccessToast({description: 'Follow request sent'});
      } else {
        await sendFollowRequest(data?._id);
        queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
        queryClient.invalidateQueries({queryKey: ['isFollowerIsFollowing']});
        showSuccessToast({description: 'Follow request sent successfully'});
      }
    } catch (error) {
      console.error('Error during follow action:', error);
      showErrorToast({
        description: 'An error occurred while sending the follow request.',
      });
    } finally {
      setFollowReqLoading(false);
    }
  };
  const cancelFollReqFun = async () => {
    setCancelReqLoad(true);
    try {
      await cancelFollowRequest(data?._id);
      queryClient.invalidateQueries({queryKey: ['isFollowerIsFollowing']});
      queryClient.invalidateQueries({queryKey: ['pendingFollowRequests']});
      showSuccessToast({description: 'Follow request canceled successfully'});
    } catch (error) {
      console.error('Error cancelling follow request:', error);
      showErrorToast({description: 'Error cancelling follow request.'});
    } finally {
      setCancelReqLoad(false);
    }
  };

  const [basicDetailsPopup, setBasicDetailsPopup] = useState(true);
  const [fullInfoPopup, setFullInfoPopup] = useState(false);
  const basecDetails = [
    {
      label: 'First Name',
      value: getValue(data?.firstName, userData?.data?.firstName),
    },
    {
      label: 'Middle Name',
      value: getValue(data?.middleName, userData?.data?.middleName),
    },
    {
      label: 'Last Name',
      value: getValue(data?.lastName, userData?.data?.lastName),
    },
    {
      label: 'Gender',
      value: getValue(data?.gender, userData?.data?.gender),
    },
  ];

  const fullDetails = [
    {label: 'Height', value: '5.6 inch'},
    {label: 'Religion', value: 'Hindu'},
    {label: 'Caste', value: 'Maratha'},
    {label: 'Whatsapp Number', value: '+91 7972755589'},
    {label: 'Profession', value: 'Software Developer'},
    {label: 'Highest Degree', value: 'B.Tech'},
    {label: 'Instagram', value: 'https://rushibhumkar.com'},
    {label: 'Facebook', value: 'https://rushibhukar.com'},
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backButton}>
        <Image
          source={require('../../assets/icons/back.png')}
          style={styles.backButtonImage}
        />
      </TouchableOpacity>
      {!showBasicDetails &&
        !showFullInfo &&
        !showSocialMedia &&
        !showRelation &&
        !showHierarchy && <NoDataFound />}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {showBasicDetails && (
          <View style={styles.header}>
            <CustomAvatar
              name={getValue(data?.firstName, userData?.data?.firstName, '')}
              style={styles.avatar}
            />

            <CustomText style={styles.nameText}>
              {`${getValue(
                data?.firstName,
                userData?.data?.firstName,
                '',
              )} ${getValue(
                data?.middleName,
                userData?.data?.middleName,
                '',
              )} ${getValue(data?.lastName, userData?.data?.lastName, '')}`}
            </CustomText>

            {isFollowerIsFollowingData?.data?.following?.status ===
              'accepted' && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  width: '100%',
                  marginTop: 8,
                  backgroundColor: '#e4e6eb',
                  paddingVertical: 12,
                  borderRadius: 8,
                }}>
                <TouchableOpacity
                  onPress={() => {
                    const phoneNumber = data?.phone;
                    Linking.openURL(`tel:${phoneNumber}`);
                  }}>
                  <Image
                    source={require('../../assets/animatedIcons/call.png')}
                    style={{height: 32, width: 32}}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate(chatRoute.ChatStack, {
                      screen: chatRoute.ChattingScreen,
                      params: {data: data},
                    })
                  }>
                  <Image
                    source={require('../../assets/bottomIcons/messageActive.png')}
                    style={{height: 32, width: 32}}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        {showSocialMedia && (
          <TouchableOpacity
            style={styles.button}
            activeOpacity={0.6}
            onPress={() => navigation.navigate(homeRoute.MediaLinksDocs)}>
            <CustomText style={styles.buttonText}>
              Medias, links and docs
            </CustomText>
            <Image
              source={require('../../assets/icons/rightArrow.png')}
              style={styles.arrowIcon}
            />
          </TouchableOpacity>
        )}
        {request && (
          <View style={styles.button}>
            <CustomText style={styles.buttonText}>Send request</CustomText>
            {followReqLoading ? (
              <OnlyLoader />
            ) : (
              <View style={{...myStyle.row, gap: 12}}>
                <CustomText
                  style={styles.followBtn}
                  onPress={handleFollowAction}
                  disabled={
                    isFollowerIsFollowingData?.data?.following?.status ===
                      'pending' ||
                    isFollowerIsFollowingData?.data?.following?.status ===
                      'accepted'
                  }>
                  {isFollowerIsFollowingData?.data?.following?.status ===
                  'accepted'
                    ? 'Following'
                    : isFollowerIsFollowingData?.data?.following?.status ===
                      'pending'
                    ? 'Request Sent'
                    : 'Follow'}
                </CustomText>
                {isFollowerIsFollowingData?.data?.following?.status ===
                  'pending' && (
                  <CustomText
                    style={styles.cancelReqBtn}
                    onPress={cancelFollReqFun}>
                    Cancel
                  </CustomText>
                )}
              </View>
            )}
          </View>
        )}
        {showChatIcon && (
          <View style={styles.premiumMainCont}>
            <View style={styles.premiumCont}>
              <Image
                source={require('../../assets/icons/premium.png')}
                style={{height: 22, width: 22}}
              />
              <View
                style={{flexDirection: 'row', alignItems: 'center', gap: 8}}>
                <CustomText style={styles.premiumText}>Premium</CustomText>
                <CustomText style={{fontSize: 15, color: 'green'}}>
                  Free
                </CustomText>
              </View>
            </View>
            <TouchableOpacity
              style={styles.msgCont}
              onPress={() =>
                navigation.navigate(chatRoute.ChatStack, {
                  screen: chatRoute.ChattingScreen,
                  params: {data: data},
                })
              }>
              <Image
                source={require('../../assets/bottomIcons/messageActive.png')}
                style={{height: 26, width: 26}}
              />
            </TouchableOpacity>
          </View>
        )}
        {showRelation && (
          <View style={styles.button}>
            <CustomText style={styles.buttonText}>
              Relation: from my father
            </CustomText>
            <CustomText style={styles.relationText} onPress={() => null}>
              See relation
            </CustomText>
          </View>
        )}
        {showHierarchy && (
          <TouchableOpacity style={styles.button} activeOpacity={0.6}>
            <CustomText style={styles.buttonText}>See hierarchy</CustomText>
            <View style={styles.buttonRight}>
              <CustomText style={styles.freeText}>Free</CustomText>
              <Image
                source={require('../../assets/icons/rightArrow.png')}
                style={styles.arrowIcon}
              />
            </View>
          </TouchableOpacity>
        )}

        {showBasicDetails && (
          <TouchableOpacity
            style={[styles.button, basicDetailsPopup && styles.openButton]}
            activeOpacity={0.6}
            onPress={() => setBasicDetailsPopup(!basicDetailsPopup)}>
            <CustomText style={styles.buttonText}>Basic details</CustomText>
            <View style={styles.buttonRight}>
              <CustomText style={styles.freeText}>Free</CustomText>
              {basicDetailsPopup ? (
                <Image
                  source={require('../../assets/icons/up.png')}
                  style={styles.arrowIcon}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/down.png')}
                  style={styles.arrowIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        )}

        {basicDetailsPopup && showBasicDetails && (
          <CustomDataListing
            data={basecDetails}
            customViewStyling={styles.listingContainer}
          />
        )}
        {showFullInfo && (
          <TouchableOpacity
            style={[styles.button, fullInfoPopup && styles.openButton]}
            activeOpacity={0.6}
            onPress={() => setFullInfoPopup(!fullInfoPopup)}>
            <CustomText style={styles.buttonText}>Full information</CustomText>
            <View style={styles.buttonRight}>
              <CustomText style={styles.freeText}>Free</CustomText>
              {fullInfoPopup ? (
                <Image
                  source={require('../../assets/icons/up.png')}
                  style={styles.arrowIcon}
                />
              ) : (
                <Image
                  source={require('../../assets/icons/down.png')}
                  style={styles.arrowIcon}
                />
              )}
            </View>
          </TouchableOpacity>
        )}
        {fullInfoPopup && showFullInfo && (
          <CustomDataListing
            data={fullDetails}
            customViewStyling={styles.listingContainer}
          />
        )}
      </ScrollView>
    </View>
  );
};

export default UsersProfileDetails;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  msgCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  premiumMainCont: {
    width: '100%',
    gap: 8,
    backgroundColor: color.smoothBg,
    paddingHorizontal: 12,
    borderRadius: 8,
    padding: 12,
    marginVertical: 12,
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  premiumCont: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  premiumText: {
    fontSize: 15,
    textDecorationLine: 'line-through',
    color: color.placeholderColor,
    fontStyle: 'italic',
  },
  backButton: {
    marginLeft: 10,
    marginTop: 10,
    padding: 12,
    alignSelf: 'flex-start',
    borderRadius: 50,
  },
  backButtonImage: {
    height: 24,
    width: 24,
  },
  cancelReqBtn: {
    color: color.mainColor,
    fontWeight: '400',
    borderRadius: 8,
    borderWidth: 0.8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    fontSize: 15,
    borderColor: color.mainColor,
  },
  scrollContainer: {
    paddingBottom: 20,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: color.smoothBg,
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  avatar: {
    height: 80,
    width: 80,
  },
  followBtn: {
    backgroundColor: color.mainColor,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 8,
    color: '#fff',
    alignSelf: 'flex-end',
  },
  followingBtn: {
    borderWidth: 0.8,
    borderColor: color.mainColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    color: color.mainColor,
  },
  reqSentBtn: {
    borderWidth: 0.8,
    borderColor: color.mainColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-end',
    color: color.mainColor,
  },
  nameText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: '500',
  },
  phoneText: {
    color: 'grey',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: color.smoothBg,
    padding: 16,
    marginTop: 12,
    borderRadius: 8,
  },
  openButton: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  buttonText: {
    color: color.titleColor,
    fontWeight: '500',
  },
  relationText: {
    color: color.mainColor,
    fontWeight: '500',
  },
  buttonRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  freeText: {
    color: color.success,
    fontSize: 14,
    fontWeight: '500',
    marginRight: 8,
  },
  arrowIcon: {
    height: 12,
    width: 12,
    tintColor: color.placeholderColor,
  },
  listingContainer: {
    backgroundColor: color.smoothBg,
    paddingHorizontal: 12,
    borderBottomRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
});
