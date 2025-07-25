import * as Yup from 'yup';
import {myConsole} from './myConsole';
import {lowercaseWithSpace} from './commonFunction';

export const phoneValidate = () =>
  Yup.string()
    .matches(/^\d{10}$/, 'Phone number must be exactly 10 digits')
    .required('Phone number is required');

export const alphabeticValidate = (min = 3, max = 50, required = true) =>
  Yup.string()
    .matches(/^[a-zA-Z]+$/, 'Only alphabetic characters are allowed')
    .min(min, `Minimum length is ${min} characters`)
    .max(max, `Maximum length is ${max} characters`)
    .when([], {
      is: required,
      then: Yup.string().required('Field is required'),
    });

export const alphanumericValidate = (min = 3, max = 50, required = true) =>
  Yup.string()
    .matches(/^[a-zA-Z0-9]+$/, 'Only alphanumeric characters are allowed')
    .min(min, `Minimum length is ${min} characters`)
    .max(max, `Maximum length is ${max} characters`)
    .when([], {
      is: required,
      then: Yup.string().required('Field is required'),
    });

export const emailValidate = (required = true) =>
  Yup.string()
    .email('Invalid email format')
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Enter a valid email address',
    )
    .when([], {
      is: required,
      then: Yup.string().required('Field is required'),
    });
