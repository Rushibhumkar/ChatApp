import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import CustomTextInput from '../../components/TextInput/CustomTextInput';
import CustomButton from '../../components/Buttons/CustomButton';
import DropdownRNE from '../../components/DropdownRNE';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {authRoute} from './routeName';
import {titleColor} from '../../sharedStyles';
import AuthHeaderComp from '../../components/Headers/AuthHeaderComp';
import {color} from '../../const/color';
import {authSignup} from '../../api/auth/authFunc';
import {myConsole} from '../../utils/myConsole';
import {showSuccessToast} from '../../utils/toastModalFunction';

const Signup = ({navigation}: any) => {
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      firstName: '',
      middleName: '',
      lastName: '',
      // dob: '',
      gender: '',
      phone: '',
      // email: '',
      password: '',
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required('First name is required'),
      middleName: Yup.string(),
      lastName: Yup.string().required('Last name is required'),
      // dob: Yup.string().required('Date of birth is required'),
      gender: Yup.string().required('Gender is required'),
      phone: Yup.string()
        .matches(/^\d{10}$/, 'Phone number is not valid')
        .required('Phone number is required'),
      // email: Yup.string().email('Invalid email').required('Email is required'),
      password: Yup.string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    }),
    onSubmit: async values => {
      setLoading(true);
      try {
        const response = await authSignup(values);
        console.log('Signup successful:', response);
        showSuccessToast({description: 'OTP sent to your phone number.'});
        navigation.navigate(authRoute.VerificationCode, {
          response: response,
          type: 'signup',
        });
      } catch (error) {
        console.error('Signup failed:', error);
      } finally {
        setLoading(false);
      }
    },
  });
  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ScrollView style={styles.container}>
        <AuthHeaderComp title="Signup" isBack />
        <CustomTextInput
          label="First Name"
          name="firstName"
          placeholder="First Name"
          formik={formik}
        />
        <CustomTextInput
          label="Middle Name"
          name="middleName"
          placeholder="Middle Name"
          formik={formik}
        />
        <CustomTextInput
          label="Last Name"
          name="lastName"
          placeholder="Last Name"
          formik={formik}
        />
        <DropdownRNE
          name="gender"
          label="Gender"
          items={[
            {label: 'Male', value: 'male'},
            {label: 'Female', value: 'female'},
            {label: 'Other', value: 'other'},
          ]}
          showSingleSelectSearchbar={false}
          formik={formik}
          mb={0}
        />
        <CustomTextInput
          label="Phone Number"
          name="phone"
          placeholder="Phone Number"
          keyboardType="number-pad"
          formik={formik}
        />
        <CustomTextInput
          label="Password"
          name="password"
          placeholder="Password"
          secureTextEntry
          formik={formik}
        />

        <Text style={styles.termsText}>
          By signing up, you're agreeing to our{' '}
          <Text style={styles.link}>T&C</Text> and{' '}
          <Text style={styles.link}>Privacy Policy</Text>
        </Text>

        <CustomButton
          title="Sign Up"
          onPress={formik.handleSubmit}
          loading={loading}
        />

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate(authRoute.Login)}>
            <Text style={styles.signInText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 80,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: titleColor,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    color: '#000',
    marginBottom: 30,
  },
  termsText: {
    marginTop: 4,
    color: '#A0A0A0',
    fontSize: 14,
    textAlign: 'left',
    marginBottom: 20,
  },
  link: {
    color: color.mainColor,
    fontWeight: '600',
  },
  toggleText: {
    color: '#6A5AE0',
    textAlign: 'right',
    marginBottom: 20,
  },
  footer: {
    marginTop: 4,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  footerText: {
    color: '#A0A0A0',
    fontSize: 14,
  },
  signInText: {
    color: color.mainColor,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default Signup;
