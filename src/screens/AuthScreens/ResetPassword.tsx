import React, {useState} from 'react';
import {View, StyleSheet, Alert} from 'react-native';
import {svgIcons} from '../../assets/svg/svg';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {authRoute} from './routeName';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import AuthHeaderComp from '../../components/Headers/AuthHeaderComp';
import CustomButton from '../../components/Buttons/CustomButton';
import {myConsole} from '../../utils/myConsole';
import {authSetPassword} from '../../api/auth/authFunc';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';

const ResetPassword = ({navigation, route}: any) => {
  const {response} = route.params;

  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object().shape({
      newPassword: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .required('New password is required'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Passwords must match')
        .required('Confirm password is required'),
    }),
    onSubmit: async (values, {setSubmitting}) => {
      setSubmitting(true);
      setLoading(true);
      try {
        const {passCode} = response.data;

        // Call API to set the password
        const resetPasswordResponse = await authSetPassword(
          passCode,
          values.newPassword,
        );

        if (resetPasswordResponse?.success) {
          showSuccessToast({description: 'Password reset successfully!'});
          navigation.navigate(authRoute.Login);
        } else {
          showErrorToast({
            description: 'Failed to reset password. Please try again.',
          });
        }
      } catch (error) {
        // myConsole('Error resetting password', error);
        showErrorToast({
          description: 'Error resetting password. Please try again.',
        });
      } finally {
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <AuthHeaderComp title="Reset Password" isBack={true} />

      <CustomTextInput
        label="New password"
        placeholder="New password"
        formik={formik}
        name="newPassword"
        secureTextEntry
      />
      <CustomTextInput
        label="Confirm password"
        placeholder="Confirm password"
        formik={formik}
        name="confirmPassword"
        secureTextEntry
      />
      <CustomButton
        title="CONFIRM"
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 10,
  },
  illustrationContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  illustration: {
    width: 150,
    height: 150,
    resizeMode: 'contain',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    fontSize: 16,
    marginLeft: 10,
  },
  submitButton: {
    backgroundColor: '#6A5AE0',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 10,
  },
});

export default ResetPassword;
