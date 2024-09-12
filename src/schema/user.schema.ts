import * as yup from 'yup';

export const loginUserSchema = yup.object({
  body: yup.object({
    email: yup.string().required('Email is required.').email('Invalid email format.'),
    password: yup.string().required('Password is required.'),
  }),
});

export const registerUserSchema = yup.object({
  body: yup.object({
    firstName: yup.string().required('First name is required.'),
    lastName: yup.string().required('Last name is required.'),
    email: yup.string().required('Email is required.').email('Invalid email format.'),
    username: yup.string().required('Username is required.'),
    password: yup
      .string()
      .required('Password is required.')
      .min(8, 'Password must be at least 8 characters.'),
  }),
});
