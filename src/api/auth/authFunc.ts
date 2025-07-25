import {myConsole} from '../../utils/myConsole';
import {
  popUpConfToast,
  showErrorToast,
  showSuccessToast,
} from '../../utils/toastModalFunction';
import {API_AXIOS} from '../axiosInstance';

export const authSignup = async (values: any) => {
  try {
    const {data} = await API_AXIOS.post('/auth/signup', values);
    return data;
  } catch (error: any) {
    showSuccessToast({
      description: error?.response?.data?.message || 'Error ',
    });
    throw error;
  }
};

export const authLogin = async (values: any) => {
  try {
    const {data} = await API_AXIOS.post('/auth/login', values);
    return data;
  } catch (error: any) {
    console.log('Login Errorsssss:', error?.response?.data || error.message);
    throw error?.response?.data;
  }
};

export const authVerifySignupOtp = async (passcode: string, otp: string) => {
  try {
    const {data} = await API_AXIOS.post(`/auth/signup/${passcode}/verify-otp`, {
      otp,
    });
    console.log('Signup OTP Verification API Response:', data);
    return data;
  } catch (error: any) {
    console.error(
      'Signup OTP Verification Error:',
      JSON.stringify(error, null, 2),
    );

    if (error instanceof Error) {
      console.error('Stack Trace:', error.stack);
    }

    throw new Error(
      error?.response?.data?.message || 'Signup OTP verification failed',
    );
  }
};

export const authVerifyLoginOtp = async (passcode: string, otp: string) => {
  try {
    const {data} = await API_AXIOS.post(`/auth/login/${passcode}/verify-otp`, {
      otp,
    });
    // console.log('Login OTP Verification API Response:', data);
    return data;
  } catch (error: any) {
    console.error(
      'Login OTP Verification Error:',
      JSON.stringify(error, null, 2),
    );

    if (error instanceof Error) {
      console.error('Stack Trace:', error.stack);
    }

    throw new Error(
      error?.response?.data?.message || 'Login OTP verification failed',
    );
  }
};

export const authForgotPassword = async (phoneOremail: any) => {
  try {
    const {data} = await API_AXIOS.post('/auth/forget-password', phoneOremail);
    return data;
  } catch (error: any) {
    console.error(
      'Forgot Password API Error:',
      error?.response?.data || error.message,
    );
    throw error.message;
  }
};

export const authVerifyForgotPassOtp = async (
  passCode: string,
  otp: string,
) => {
  try {
    const {data} = await API_AXIOS.post(
      `/auth/forget-password/${passCode}/verify-otp`,
      {
        otp,
      },
    );
    console.log('OTP Verification Response:', data);
    return data;
  } catch (error: any) {
    console.error(
      'OTP Verification API Errorsssss:',
      error?.response?.data || error.message,
    );
    throw error;
  }
};

export const authSetPassword = async (passCode: string, password: string) => {
  try {
    const {data} = await API_AXIOS.post(
      `/auth/forget-password/${passCode}/set-password`,
      {password},
    );
    console.log('Set Password API Response:', data);
    return data;
  } catch (error: any) {
    console.error(
      'Set Password API Error:',
      error?.response?.data || error.message,
    );
    throw error.message;
  }
};

export const authResendOtp = async (passCode: string) => {
  try {
    const {data} = await API_AXIOS.get(`/auth/login/${passCode}/resend-otp`);
    console.log('Resend OTP API Response:', data);
    return data;
  } catch (error: any) {
    console.error(
      'Resend OTP API Error:',
      error?.response?.data || error.message,
    );
    throw error.message;
  }
};
