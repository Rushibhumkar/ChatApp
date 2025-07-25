import React, {useState} from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  ActivityIndicator,
  Image,
} from 'react-native';
import MainContainer from '../../components/MainContainer';
import {useGetAllUsers} from '../../api/user/userFunc';
import {myConsole} from '../../utils/myConsole';
import CustomText from '../../components/CustomText';
import DropdownRNE from '../../components/DropdownRNE';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import CustomPhoneInput from '../../components/CustomPhoneInput';
import {color} from '../../const/color';
import CustomAvatar from '../../components/CustomAvatar';
import CustomButton from '../../components/Buttons/CustomButton';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useRoute} from '@react-navigation/native';

const {height: screenHeight} = Dimensions.get('window');

const relationGenderMap: {[key: string]: string} = {
  wife: 'female',
  husband: 'male',
  father: 'male',
  mother: 'female',
  brother: 'male',
  sister: 'female',
  son: 'male',
  daughter: 'female',
};

const AddMember = ({navigation}: any) => {
  const [searchValue, setSearchValue] = useState('');
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const route = useRoute<any>();
  const onSubmitFromParent = route.params?.onSubmit;
  const {data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading} =
    useGetAllUsers(searchValue, 10);

  const allUsers = data?.pages.flatMap(page => page.data?.users || []) || [];

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: '',
      fName: '',
      phone: '',
      relation: '',
      gender: '',
    },
    validationSchema: Yup.object().shape({
      relation: Yup.string().required('Relation is required'),
      fName: Yup.string().when('userId', {
        is: val => !val,
        then: () => Yup.string().required('First name is required'),
        otherwise: () => Yup.string().notRequired(),
      }),
      phone: Yup.string().when('userId', {
        is: val => !val,
        then: () =>
          Yup.string()
            .matches(/^[0-9]{10}$/, 'Enter valid 10-digit phone number')
            .required('Phone number is required'),
        otherwise: () => Yup.string().notRequired(),
      }),
    }),

    onSubmit: values => {
      const payload = values.userId
        ? {
            userId: values.userId,
            relation: values.relation,
            gender: values.gender,
          }
        : {
            fName: values.fName,
            phone: values.phone,
            relation: values.relation,
            gender: values.gender,
          };

      myConsole('Submitted Payload:', payload);

      if (onSubmitFromParent) {
        onSubmitFromParent(payload);
      }

      navigation.goBack();
    },
  });

  const handleSelectUser = (user: any) => {
    setSelectedUser(user);
    setSearchValue('');
    formik.setFieldValue('userId', user._id);
  };

  const handleRelationChange = (value: string) => {
    formik.setFieldValue('relation', value);
    const gender = relationGenderMap[value.toLowerCase()];
    if (gender) {
      formik.setFieldValue('gender', gender);
      console.log('Auto-filled gender:', gender);
    }
  };
  return (
    <MainContainer title="Add Member" isBack>
      {/* Search Box */}
      <View style={styles.container}>
        <View style={styles.inputMainBox}>
          <TextInput
            style={styles.input}
            placeholder="Search user by name or phone"
            placeholderTextColor="#999"
            value={searchValue}
            onChangeText={text => setSearchValue(text)}
          />
          {searchValue !== '' && (
            <TouchableOpacity
              style={{backgroundColor: '#fff'}}
              onPress={() => setSearchValue('')}>
              <Image
                source={require('../../assets/icons/crossWithCircle.png')}
                style={{height: 26, width: 26}}
                tintColor={'#c4c4c4'}
              />
            </TouchableOpacity>
          )}
        </View>

        {searchValue.trim().length > 0 && (
          <View style={styles.dropdown}>
            <ScrollView
              onScroll={({nativeEvent}) => {
                const {layoutMeasurement, contentOffset, contentSize} =
                  nativeEvent;
                const isBottomReached =
                  layoutMeasurement.height + contentOffset.y >=
                  contentSize.height - 20;
                if (isBottomReached && hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              scrollEventThrottle={100}>
              {isLoading ? (
                <ActivityIndicator style={{marginTop: 10}} />
              ) : allUsers.length === 0 ? (
                <CustomText style={styles.noResult}>
                  No results found
                </CustomText>
              ) : (
                allUsers.map(user => (
                  <TouchableOpacity
                    key={user._id}
                    style={styles.userItem}
                    onPress={() => handleSelectUser(user)}>
                    <CustomText>{`${user.firstName} ${
                      user.lastName || ''
                    }`}</CustomText>
                    <CustomText style={styles.phone}>{user.phone}</CustomText>
                  </TouchableOpacity>
                ))
              )}
              {isFetchingNextPage && (
                <ActivityIndicator style={{marginVertical: 10}} size="small" />
              )}
            </ScrollView>
          </View>
        )}

        {/* Selected user preview */}
        {selectedUser && (
          <View style={styles.selectedMainBox}>
            <View style={styles.selectedBox}>
              <CustomAvatar name={selectedUser.firstName} />
              <View>
                <CustomText>{`${selectedUser.firstName} ${
                  selectedUser.lastName || ''
                }`}</CustomText>
                <CustomText>{selectedUser.phone}</CustomText>
              </View>
            </View>
            <TouchableOpacity onPress={() => setSelectedUser(null)}>
              <Image
                source={require('../../assets/icons/crossWithCircle.png')}
                style={{height: 26, width: 26}}
                tintColor={'#c4c4c4'}
              />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Form */}
      <View style={styles.container}>
        <DropdownRNE
          showSingleSelectSearchbar={false}
          label="Select Relation"
          items={Object.keys(relationGenderMap).map(key => ({
            label: key.charAt(0).toUpperCase() + key.slice(1),
            value: key,
          }))}
          name="relation"
          val={formik.values.relation}
          formik={formik}
          onChange={item => handleRelationChange(item.value)}
        />

        {!selectedUser && (
          <>
            <CustomTextInput
              name="fName"
              label="First Name"
              placeholder="Enter First Name"
              formik={formik}
            />
            <CustomPhoneInput
              label="Phone Number"
              name="phone"
              formik={formik}
            />
          </>
        )}
        <CustomTextInput
          name="gender"
          label="Gender"
          placeholder="Auto-filled from relation"
          formik={formik}
          disabled
        />

        <CustomButton
          title="Submit"
          onPress={async () => {
            const errors = await formik.validateForm();

            if (Object.keys(errors).length > 0) {
              const touchedFields = selectedUser
                ? {relation: true}
                : {relation: true, fName: true, phone: true};
              formik.setTouched(touchedFields);
              return;
            }

            formik.handleSubmit();
          }}
          mt={20}
        />
      </View>
    </MainContainer>
  );
};

export default AddMember;

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingHorizontal: 16,
  },
  inputMainBox: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 45,
  },
  input: {
    height: 45,

    color: '#000',
  },
  dropdown: {
    maxHeight: screenHeight * 0.3,
    backgroundColor: '#f2f2f2',
    marginTop: 4,
    borderRadius: 8,
    padding: 8,
  },
  userItem: {
    paddingVertical: 8,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  phone: {
    fontSize: 12,
    color: '#666',
  },
  noResult: {
    textAlign: 'center',
    color: '#999',
    marginTop: 8,
  },
  selectedBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  selectedMainBox: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    backgroundColor: `${color.mainColor}40`,
    borderRadius: 8,
  },
});
