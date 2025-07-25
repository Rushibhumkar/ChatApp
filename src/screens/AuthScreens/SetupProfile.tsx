import React from 'react';
import {View, StyleSheet, Text, Alert} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import {homeRoute} from './routeName';
import CustomAvatar from '../../components/CustomAvatar';

const SetupProfile: React.FC = ({navigation, onLogin}: any) => {
  const validationSchema = Yup.object({
    username: Yup.string()
      .min(3, 'Username must be at least 3 characters long')
      .required('Username is required'),
  });

  const formik = useFormik({
    initialValues: {
      username: '',
    },
    validationSchema,
    onSubmit: values => {
      onLogin();
    },
  });

  return (
    <View style={styles.container}>
      <CustomAvatar
        name={formik.values.username || 'A'}
        mb={20}
        style={{width: 100, height: 100}}
      />
      <Text style={styles.title}>Set up your profile</Text>
      <CustomTextInput
        name="username"
        placeholder="Enter your username"
        formik={formik}
      />
      <CustomButton title="Continue" onPress={formik.handleSubmit} mt={30} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatar: {
    height: 100,
    width: 100,
    borderRadius: 50,
    backgroundColor: '#6E85FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 36,
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#000',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 4,
  },
});

export default SetupProfile;
