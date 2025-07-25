// hooks/useAddMemberFormik.ts
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {myConsole} from '../utils/myConsole';

export const useAddMemberFormik = ({
  selectedUser,
  relation,
}: {
  selectedUser: any;
  relation: string;
}) => {
  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      userId: selectedUser?._id || '',
      fName: '',
      phone: '',
      relation,
    },
    validationSchema: Yup.object().shape({
      fName: Yup.string().when('userId', {
        is: val => !val,
        then: Yup.string().required('First name is required'),
      }),
      phone: Yup.string().when('userId', {
        is: val => !val,
        then: Yup.string()
          .matches(/^[0-9]{10}$/, 'Enter valid 10-digit phone number')
          .required('Phone number is required'),
      }),
      relation: Yup.string().required('Relation is required'),
    }),
    onSubmit: values => {
      const payload = {
        userId: selectedUser?._id || undefined,
        relation,
        ...(selectedUser
          ? {}
          : {
              fName: values.fName,
              phone: values.phone,
            }),
      };

      myConsole('Submitted Payload:', payload);
    },
  });

  return formik;
};
