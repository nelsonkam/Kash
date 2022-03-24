import * as Yup from 'yup';

export const validateRegistration = Yup.object({
  name: Yup.string().required('Ce champ est requis'),
  password: Yup.string()
    .required('Ce champ est requis.')
    .min(8, 'Ton mot de passe doit contenir au moins 8 caractères.'),
  confirm: Yup.string()
    .oneOf([Yup.ref('password')], 'Tes mots de passe ne correspondent pas')
    .required('Ce champ est requis'),
});

export const validateLoginWithEmailOrKashtag = Yup.object({
  username: Yup.string().required('Ce champ est requis'),
  password: Yup.string()
    .required('Ce champ est requis.')
    .min(8, 'Ton mot de passe doit contenir au moins 8 caractères.'),
});

export const validateLoginWithPhone = Yup.object({
  phone: Yup.string().required('Ce champ est requis'),
  password: Yup.string()
    .required('Ce champ est requis')
    .min(8, 'Ton mot de passe doit contenir au moins 8 caractères.'),
});

export const validateEmail = Yup.object({
  email: Yup.string()
    .required('Ce champ est requis')
    .email("L'email ci n'est pas valide"),
});
