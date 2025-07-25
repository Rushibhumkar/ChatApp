import React, {useState, useRef} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import CustomButton from '../../components/Buttons/CustomButton';
import AuthHeaderComp from '../../components/Headers/AuthHeaderComp';
import {myConsole} from '../../utils/myConsole';
import {
  authVerifySignupOtp,
  authVerifyLoginOtp,
  authVerifyForgotPassOtp,
} from '../../api/auth/authFunc';
import {storeData} from '../../hooks/useAsyncStorage';
import {
  popUpConfToast,
  showErrorToast,
  showSuccessToast,
} from '../../utils/toastModalFunction';
import {authRoute} from './routeName';

const VerificationCode = ({navigation, route}: any) => {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  const {response, type, auth} = route.params;

  const handleChangeText = (text: string, index: number) => {
    if (isNaN(Number(text))) return;
    let newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleSubmit = async () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length < 6) {
      showErrorToast({description: 'Please enter a 6-digit OTP'});
      return;
    }
    setLoading(true);
    try {
      let verifyResponse;
      if (type === 'signup') {
        verifyResponse = await authVerifySignupOtp(
          response?.data?.passCode,
          enteredOtp,
        );
      } else if (type === 'login') {
        verifyResponse = await authVerifyLoginOtp(
          response?.data?.passCode,
          enteredOtp,
        );
      } else if (type === 'forgotPassword') {
        verifyResponse = await authVerifyForgotPassOtp(
          response?.data?.passCode,
          enteredOtp,
        );
      }

      if (type === 'forgotPassword' && verifyResponse?.success) {
        navigation.navigate(authRoute.ResetPassword, {
          response: verifyResponse,
        });
      } else if (verifyResponse?.success) {
        const {authToken, refreshToken} = verifyResponse?.data;
        await storeData('authToken', authToken);
        await storeData('refreshToken', refreshToken);
        // popUpConfToast.successMessage('OTP Verified Successfully');
        showSuccessToast({description: 'OTP Verified Successfully'});
        navigation.reset({
          index: 0,
          routes: [{name: 'Main'}],
        });
      } else {
        throw new Error('Invalid OTP response from server');
      }
    } catch (error) {
      console.log('OTP Verification Error:ssss', error);
      showErrorToast({description: 'Invalid OTP, please try again'});
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <AuthHeaderComp title="Verification Code" isBack />
      <Text style={styles.description}>
        We have sent the verification code to your email/phone number
      </Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={ref => (inputRefs.current[index] = ref)}
            style={styles.otpInput}
            value={digit}
            onChangeText={text => handleChangeText(text, index)}
            keyboardType="numeric"
            maxLength={1}
            onKeyPress={({nativeEvent}) => {
              if (nativeEvent.key === 'Backspace' && index > 0 && !otp[index]) {
                inputRefs.current[index - 1]?.focus();
              }
            }}
          />
        ))}
      </View>
      <CustomButton title="Confirm" onPress={handleSubmit} loading={loading} />
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
    marginBottom: 30,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  otpInput: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    width: 50,
    height: 50,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
});

export default VerificationCode;
