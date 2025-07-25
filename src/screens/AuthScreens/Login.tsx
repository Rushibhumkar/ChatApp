import React, {useState} from 'react';
import {View, Text, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import {authRoute} from './routeName';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import AuthHeaderComp from '../../components/Headers/AuthHeaderComp';
import {color} from '../../const/color';
import {authLogin} from '../../api/auth/authFunc';
import {myConsole} from '../../utils/myConsole';
import {showErrorToast, showSuccessToast} from '../../utils/toastModalFunction';

const Login = ({navigation, onLogin}: any) => {
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      phoneOremail: '',
      password: '',
    },
    validationSchema: Yup.object({
      phoneOremail: Yup.string().trim().required('Phone number is required'),
      password: Yup.string().required('Password is required'),
    }),
    onSubmit: async values => {
      setLoading(true);
      try {
        const response = await authLogin(values);
        if (response.success) {
          console.log('Login successful:', response);
          navigation.navigate(authRoute.VerificationCode, {
            response: response,
            type: 'login',
            auth: {
              phoneOremail: formik.values.phoneOremail,
              password: formik.values.password,
            },
          });
          showSuccessToast({description: 'OTP sent to your phone number.'});
        }
      } catch (error: any) {
        showErrorToast({
          description:
            error?.message || 'Invalid credentials, please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <View style={styles.container}>
      <AuthHeaderComp title="Login" />
      <View style={{marginTop: 40}} />
      <CustomTextInput
        label="Phone Number"
        name="phoneOremail"
        placeholder="Enter your phone number"
        keyboardType="number-pad"
        formik={formik}
      />
      <CustomTextInput
        label="Password"
        name="password"
        placeholder="Enter your password"
        secureTextEntry
        formik={formik}
      />
      <TouchableOpacity
        style={{
          paddingTop: 8,
          alignSelf: 'flex-end',
          marginRight: 4,
        }}
        onPress={() => navigation.navigate(authRoute.ForgotPassword)}>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <CustomButton
        title="LOGIN"
        onPress={formik.handleSubmit}
        loading={loading}
        disabled={loading}
      />

      <View style={styles.footer}>
        <Text style={styles.footerText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate(authRoute.Signup)}>
          <Text style={styles.signUpText}>SignUp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
  },
  forgotPassword: {
    color: color.mainColor,
    textAlign: 'right',
    marginBottom: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 12,
  },
  footerText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  signUpText: {
    color: color.mainColor,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Login;
