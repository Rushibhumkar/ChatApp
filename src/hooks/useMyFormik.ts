import {useFormik} from 'formik';
import {useMemo} from 'react';
import {myConsole} from '../utils/myConsole';

interface UseMyFormikProps {
  initialValues: {[key: string]: any}; // Accept dynamic keys with any value type
}

export const useMyFormik = ({initialValues}: UseMyFormikProps) => {
  const formik = useFormik({
    initialValues: {
      ...initialValues, // Spread the dynamic initial values
    },
    onSubmit: values => {
      // myConsole('Form Submitted', values); // Handle form submission
    },
  });

  // Memoize formik.values to optimize frequent accesses
  const formValues = useMemo(() => formik.values, [formik.values]);

  return {
    ...formik,
    values: formValues, // Return memoized values
  };
};
