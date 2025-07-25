import React, {useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import AuthHeaderComp from '../../components/Headers/AuthHeaderComp';
import CustomButton from '../../components/Buttons/CustomButton';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {authRoute} from './routeName';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import {authForgotPassword} from '../../api/auth/authFunc';
import {myConsole} from '../../utils/myConsole';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';

const ForgotPassword = ({navigation}: any) => {
  const [loading, setLoading] = useState(false);
  const formik = useFormik({
    initialValues: {
      phoneOremail: '',
    },
    validationSchema: Yup.object({
      phoneOremail: Yup.string().trim().required('Username is required'),
    }),
    onSubmit: async values => {
      setLoading(true);
      try {
        const res = await authForgotPassword(values);
        showSuccessToast({
          description: res?.message || 'OTP sent successfully',
        });
        navigation.navigate(authRoute.VerificationCode, {
          response: res,
          type: 'forgotPassword',
        });
      } catch (error: any) {
        showErrorToast({
          description:
            error?.response?.data?.message ||
            'Something went wrong. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <View style={styles.container}>
      <AuthHeaderComp title="Forgot Password?" isBack />
      <Text style={styles.description}>
        Don't worry! It happens. Please enter the address associated with your
        account.
      </Text>
      <CustomTextInput
        label="Email/Phone number"
        name="phoneOremail"
        placeholder="Enter Email/Phone number"
        formik={formik}
      />
      <CustomButton
        title="Submit"
        onPress={formik.handleSubmit}
        loading={loading}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  description: {
    textAlign: 'center',
    color: '#A0A0A0',
    fontSize: 14,
    marginBottom: 20,
  },
});

export default ForgotPassword;
