import * as yup from 'yup';

export const fileMailerSchema = yup.object({
  email: yup.string().required('Please enter your email.'),
  code: yup.string().required('No Code Provided'),
});
